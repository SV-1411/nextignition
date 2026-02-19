import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import axios from 'axios';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import User from '../models/User';
import CofounderProfile from '../models/CofounderProfile';
import Startup from '../models/Startup';
import PitchDeckAnalysis from '../models/PitchDeckAnalysis';

// OpenRouter API - works with many models, much cheaper than direct OpenAI
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_OPENROUTER_MODEL = 'meta-llama/llama-3.1-8b-instruct:free';
const DEFAULT_OPENROUTER_TEXT_MODEL = 'qwen/qwen-2.5-7b-instruct:free';
const DEFAULT_BYTEZ_TEXT_MODEL = 'Qwen/Qwen-7B';

const sanitizeEnvValue = (value?: string) => {
    if (!value) return '';
    return value.trim().replace(/^['"`]+|['"`]+$/g, '').trim();
};

const normalizeMessagesForModel = (
    messages: { role: string; content: string }[],
    omitSystemRole: boolean
) => {
    if (!omitSystemRole) {
        return messages;
    }

    const systemInstructions = messages
        .filter((message) => message.role === 'system')
        .map((message) => message.content.trim())
        .filter(Boolean)
        .join('\n\n');

    const nonSystemMessages = messages.filter((message) => message.role !== 'system');
    if (!systemInstructions) {
        return nonSystemMessages;
    }

    const mergedMessage = {
        role: 'user',
        content: `Follow these instructions for all subsequent responses:\n${systemInstructions}`,
    };

    return [mergedMessage, ...nonSystemMessages];
};

const getOpenRouterTextModel = () =>
    sanitizeEnvValue(process.env.OPENROUTER_TEXT_MODEL) ||
    sanitizeEnvValue(process.env.OPENROUTER_MODEL) ||
    DEFAULT_OPENROUTER_TEXT_MODEL;

const callOpenRouter = async (
    messages: { role: string; content: string }[],
    model?: string,
    allowDefaultRetry = true,
    omitSystemRole = false
) => {
    const apiKey = sanitizeEnvValue(process.env.OPENROUTER_API_KEY);
    if (!apiKey) return null;

    const targetModel = sanitizeEnvValue(model) || DEFAULT_OPENROUTER_MODEL;
    const payloadMessages = normalizeMessagesForModel(messages, omitSystemRole);

    try {
        const response = await axios.post(
            OPENROUTER_API_URL,
            {
                model: targetModel,
                messages: payloadMessages,
                max_tokens: 1024,
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:3000',
                    'X-Title': 'NextIgnition Platform',
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error: any) {
        const status = error?.response?.status;
        const providerCode = error?.response?.data?.error?.code;
        const providerMessage = String(error?.response?.data?.error?.message || '').toLowerCase();
        const providerRaw = String(error?.response?.data?.error?.metadata?.raw || '').toLowerCase();
        const modelInstructionUnsupported =
            providerMessage.includes('developer instruction is not enabled') ||
            providerRaw.includes('developer instruction is not enabled') ||
            providerMessage.includes('invalid_argument') ||
            providerRaw.includes('invalid_argument');
        if (status === 401 || status === 403 || providerCode === 401 || providerCode === 403) {
            console.error('OpenRouter auth error. Check OPENROUTER_API_KEY.');
            return null;
        }
        if ((status === 400 || providerCode === 400) && modelInstructionUnsupported) {
            if (!omitSystemRole) {
                console.warn(`OpenRouter model incompatible with system instructions (${targetModel}). Retrying without system-role messages.`);
                return await callOpenRouter(messages, targetModel, allowDefaultRetry, true);
            }
            if (allowDefaultRetry && targetModel !== DEFAULT_OPENROUTER_MODEL) {
                console.warn(`OpenRouter model incompatible with system instructions (${targetModel}). Retrying with default model.`);
                return await callOpenRouter(messages, DEFAULT_OPENROUTER_MODEL, false, true);
            }
            console.error('OpenRouter model rejected prompt format. Check OPENROUTER_PITCH_DECK_MODEL.');
            return null;
        }
        if (status === 404 || providerCode === 404 || providerMessage.includes('no endpoints found')) {
            if (allowDefaultRetry && targetModel !== DEFAULT_OPENROUTER_MODEL) {
                console.warn(`OpenRouter model unavailable (${targetModel}). Retrying with default model.`);
                return await callOpenRouter(messages, DEFAULT_OPENROUTER_MODEL, false, omitSystemRole);
            }
            console.error('OpenRouter model unavailable. Check OPENROUTER_PITCH_DECK_MODEL.');
            return null;
        }
        if (
            status === 429 ||
            providerCode === 429 ||
            providerMessage.includes('rate-limit') ||
            providerMessage.includes('rate limited') ||
            providerRaw.includes('rate-limit') ||
            providerRaw.includes('rate limited')
        ) {
            if (allowDefaultRetry && targetModel !== DEFAULT_OPENROUTER_MODEL) {
                console.warn(`OpenRouter model rate-limited (${targetModel}). Retrying with default model.`);
                return await callOpenRouter(messages, DEFAULT_OPENROUTER_MODEL, false, omitSystemRole);
            }
            console.warn('OpenRouter is temporarily rate-limited. Falling back to alternate provider if configured.');
            return null;
        }
        throw error;
    }
};

const extractJsonFromText = (text: string) => {
    const trimmed = text.trim();
    const fencedMatch = trimmed.match(/```json\s*([\s\S]*?)\s*```/i) || trimmed.match(/```\s*([\s\S]*?)\s*```/i);
    const candidate = fencedMatch?.[1] || trimmed;
    const firstBrace = candidate.indexOf('{');
    const lastBrace = candidate.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
        return candidate.slice(firstBrace, lastBrace + 1);
    }
    return candidate;
};

const parseJsonFromText = (text: string) => {
    try {
        const jsonStr = extractJsonFromText(text);
        return JSON.parse(jsonStr);
    } catch {
        return null;
    }
};

const callOpenRouterJson = async (messages: { role: string; content: string }[], model?: string) => {
    const responseText = await callOpenRouter(messages, model);
    if (!responseText) return null;
    return parseJsonFromText(responseText);
};

const normalizeArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof value === 'string') {
        return value
            .split('\n')
            .map((line) => line.replace(/^[-•\s]+/, '').trim())
            .filter(Boolean);
    }
    return [];
};

const getUserContext = async (userId: string) => {
    const user = await User.findById(userId).select('name role roles profile').lean();
    if (!user) return { user: null, contextText: 'No user profile available.' };
    const profile = user.profile || {};
    const contextText = `User profile:\n- Name: ${user.name}\n- Role: ${user.role}\n- Location: ${profile.location || 'N/A'}\n- Bio: ${profile.bio || 'N/A'}\n- Skills: ${(profile.skills || []).join(', ') || 'N/A'}\n- Interests: ${(profile.interests || []).join(', ') || 'N/A'}\n- Expertise: ${(profile.expertise || []).join(', ') || 'N/A'}\n- Experience: ${profile.experience || 'N/A'}`;
    return { user, contextText };
};

const computeMatchScore = (a: string[], b: string[]) => {
    const lowerA = a.map((item) => item.toLowerCase());
    const lowerB = b.map((item) => item.toLowerCase());
    const overlap = lowerA.filter((item) => lowerB.includes(item)).length;
    return overlap;
};

const parseGeminiAnalysis = (text: string) => {
    try {
        const jsonStr = extractJsonFromText(text);
        const parsed = JSON.parse(jsonStr);
        return {
            summary: String(parsed.executiveSummary || parsed.summary || '').trim(),
            highlights: Array.isArray(parsed.highlights)
                ? parsed.highlights.map((item: unknown) => String(item)).filter(Boolean)
                : [],
            strengths: Array.isArray(parsed.strengths)
                ? parsed.strengths.map((item: unknown) => String(item)).filter(Boolean)
                : [],
            gaps: Array.isArray(parsed.gaps)
                ? parsed.gaps.map((item: unknown) => String(item)).filter(Boolean)
                : [],
            investorReadinessScore:
                typeof parsed.investorReadinessScore === 'number' ? parsed.investorReadinessScore : undefined,
            raw: text,
        };
    } catch {
        return {
            summary: text,
            highlights: [],
            raw: text,
        };
    }
};

const callGeminiWithFile = async (filePath: string, mimeType: string, prompt: string) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const fileBuffer = await fs.readFile(filePath);
    const base64Data = fileBuffer.toString('base64');

    const response = await axios.post(
        `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`,
        {
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64Data,
                            },
                        },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 2048,
                responseMimeType: 'application/json',
            },
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 60000,
        }
    );

    const text = response.data?.candidates?.[0]?.content?.parts
        ?.map((part: any) => part?.text)
        .filter(Boolean)
        .join('\n')
        ?.trim();

    if (!text) {
        throw new Error('Gemini returned an empty analysis response');
    }

    return text;
};

const callGeminiWithText = async (content: string, prompt: string) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    const response = await axios.post(
        `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`,
        {
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: `${prompt}\n\nDeck content:\n${content}` },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 2048,
                responseMimeType: 'application/json',
            },
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 60000,
        }
    );

    const text = response.data?.candidates?.[0]?.content?.parts
        ?.map((part: any) => part?.text)
        .filter(Boolean)
        .join('\n')
        ?.trim();

    if (!text) {
        throw new Error('Gemini returned an empty analysis response');
    }

    return text;
};

const stringifyUnknownOutput = (value: any): string => {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (typeof item === 'string') return item;
                if (item && typeof item === 'object') {
                    if (typeof item.text === 'string') return item.text;
                    if (typeof item.content === 'string') return item.content;
                }
                try {
                    return JSON.stringify(item);
                } catch {
                    return String(item);
                }
            })
            .filter(Boolean)
            .join('\n');
    }
    if (value && typeof value === 'object') {
        if (typeof value.text === 'string') return value.text;
        if (typeof value.content === 'string') return value.content;
        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
    }
    return String(value ?? '');
};

const callBytez = async (messages: { role: string; content: string }[], overrideModelName?: string) => {
    const apiKey = process.env.BYTEZ_API_KEY;
    if (!apiKey) return null;

    try {
        const moduleRef = require('bytez.js');
        const Bytez = moduleRef?.default || moduleRef;
        const sdk = new Bytez(apiKey);
        const modelName =
            sanitizeEnvValue(overrideModelName) ||
            sanitizeEnvValue(process.env.BYTEZ_MODEL) ||
            'google/gemini-2.5-pro';
        const model = sdk.model(modelName);

        const { error, output } = await model.run(messages.map((message) => ({
            role: message.role,
            content: message.content,
        })));

        if (error) {
            console.error('Bytez error:', error);
            return null;
        }

        const text = stringifyUnknownOutput(output).trim();
        return text || null;
    } catch (error: any) {
        console.error('Bytez call failed:', error?.message || error);
        return null;
    }
};

const callTextModelWithFallback = async (messages: { role: string; content: string }[]) => {
    const openRouterResponse = await callOpenRouter(messages, getOpenRouterTextModel());
    if (openRouterResponse && String(openRouterResponse).trim()) {
        return openRouterResponse;
    }

    const bytezTextModel =
        sanitizeEnvValue(process.env.BYTEZ_TEXT_MODEL) ||
        DEFAULT_BYTEZ_TEXT_MODEL;
    const bytezResponse = await callBytez(messages, bytezTextModel);
    if (bytezResponse && String(bytezResponse).trim()) {
        return bytezResponse;
    }

    return null;
};

export const generateStartupSummary = async (req: AuthRequest, res: Response) => {
    try {
        const { idea } = req.body;

        const aiResponse = await callTextModelWithFallback([
            {
                role: 'system',
                content: 'You are an expert venture capitalist and startup strategist named Ignisha. Your goal is to transform complex startup ideas into compelling, investor-ready summaries. Be encouraging but realistic. Use emojis sparingly. Format with markdown.'
            },
            {
                role: 'user',
                content: `Please generate an investor-ready summary for this startup idea: ${idea}`
            }
        ]);

        if (!aiResponse) {
            return res.status(502).json({ message: 'AI provider unavailable for startup summary.' });
        }

        res.json({ summary: aiResponse });
    } catch (error: any) {
        console.error('AI Error:', error?.response?.data || error.message);
        res.status(500).json({ message: 'AI Generation failed', error: error.message });
    }
};

export const summarizeProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { profile } = req.body;
        const aiResponse = await callTextModelWithFallback([
            {
                role: 'system',
                content: 'You are a career advisor and startup mentor. Analyze the user profile and provide actionable insights about their strengths, areas for growth, and networking suggestions.'
            },
            {
                role: 'user',
                content: `Analyze this founder profile and give insights: ${JSON.stringify(profile)}`
            }
        ]);

        if (!aiResponse) {
            return res.status(502).json({ message: 'AI provider unavailable for profile summary.' });
        }

        res.json({ summary: aiResponse });
    } catch (error: any) {
        console.error('AI Error:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Profile summarization failed' });
    }
};

export const summarizePitchDeck = async (req: AuthRequest, res: Response) => {
    console.log('summarizePitchDeck hit:', {
        method: req.method,
        path: req.path,
        hasFile: !!(req as any).file,
        contentLength: Number(req.headers['content-length'] || 0),
        contentType: req.headers['content-type'],
    });

    const file = (req as any).file as Express.Multer.File | undefined;
    const uploadedPath = file?.path;
    try {
        const { content } = req.body;

        if (!file && !content) {
            return res.status(400).json({ message: 'Please upload a pitch deck file or provide deck content.' });
        }

        if (!process.env.OPENROUTER_API_KEY && !process.env.GEMINI_API_KEY) {
            return res.json({
                summary: '📊 **Pitch Deck Analysis (Demo Mode):** Add `OPENROUTER_API_KEY` to enable real AI pitch deck review.',
                highlights: [
                    'Problem and solution clarity',
                    'Market size and positioning',
                    'Business model and monetization',
                    'Team credibility',
                    'Funding ask and use of funds',
                ],
            });
        }

        const analysisPrompt = `You are an expert venture analyst. Analyze this startup pitch deck and return STRICT JSON with this shape:
{
  "executiveSummary": "string",
  "highlights": ["string", "string", "string"],
  "strengths": ["string", "string"],
  "gaps": ["string", "string"],
  "investorReadinessScore": 0
}

Rules:
- Use concise, investor-grade language.
- Score must be an integer from 0 to 100.
- If information is missing, mention it in gaps.
- Do not include markdown or extra text outside JSON.`;

        const deckText = String(content || '').trim();
        const hasDeckText = deckText.length > 0;
        const metadataContext = file
            ? `File metadata:\n- Name: ${file.originalname}\n- Mime type: ${file.mimetype}\n- Size bytes: ${file.size}`
            : 'No uploaded file metadata available.';

        const userPrompt = hasDeckText
            ? `Analyze this pitch deck content:\n\n${deckText}`
            : `A pitch deck file was uploaded but extracted text is not available. Use the following metadata and provide a best-effort investor review with explicit assumptions.\n\n${metadataContext}`;

        let responseText = '';

        if (process.env.OPENROUTER_API_KEY) {
            const openRouterModel =
                sanitizeEnvValue(process.env.OPENROUTER_PITCH_DECK_MODEL) ||
                sanitizeEnvValue(process.env.OPENROUTER_MODEL) ||
                DEFAULT_OPENROUTER_MODEL;
            const openRouterResponse = await callOpenRouter([
                {
                    role: 'system',
                    content: 'You are an expert pitch deck analyst. Return concise JSON only with executiveSummary, highlights, strengths, gaps, investorReadinessScore (0-100 integer).'
                },
                {
                    role: 'user',
                    content: `${analysisPrompt}\n\n${userPrompt}`
                }
            ], openRouterModel);

            if (openRouterResponse) {
                responseText = openRouterResponse;
            }
        }

        if (!responseText && process.env.GEMINI_API_KEY) {
            if (file && file.path && file.mimetype) {
                responseText = await callGeminiWithFile(file.path, file.mimetype, analysisPrompt) || '';
            } else {
                const fallback = await callGeminiWithText(String(content || ''), analysisPrompt);
                if (fallback) {
                    responseText = fallback;
                }
            }
        }

        if (!responseText) {
            const bytezResponse = await callBytez([
                {
                    role: 'user',
                    content: `${analysisPrompt}\n\n${userPrompt}`,
                },
            ]);
            if (bytezResponse) {
                responseText = bytezResponse;
            }
        }

        if (!responseText) {
            return res.json({
                summary: '📊 **Pitch Deck Analysis (Fallback Mode):** AI provider is currently unavailable or API key is invalid. Please verify `OPENROUTER_API_KEY` in `server/.env`.',
                highlights: [
                    'Problem and solution clarity',
                    'Market size and positioning',
                    'Business model and monetization',
                    'Team credibility',
                    'Funding ask and use of funds',
                ],
            });
        }

        const parsed = parseGeminiAnalysis(responseText);
        if (req.user?.id) {
            try {
                await PitchDeckAnalysis.create({
                    user: req.user.id,
                    analysis: parsed,
                    source: file?.originalname || 'uploaded',
                });
            } catch (error: any) {
                console.warn('Failed to store pitch deck analysis:', error?.message || error);
            }
        }
        return res.json(parsed);
    } catch (error: any) {
        console.error('AI Error (summarizePitchDeck):', error?.response?.data || error.message);
        // Graceful fallback instead of hard failure so the UI still shows a helpful result
        return res.json({
            summary: '📊 **Pitch Deck Analysis (Fallback Mode):** AI provider is currently unavailable or API key is invalid. Please verify `OPENROUTER_API_KEY`, `GEMINI_API_KEY`, or `BYTEZ_API_KEY` in `server/.env`.',
            highlights: [
                'Problem and solution clarity',
                'Market size and positioning',
                'Business model and monetization',
                'Team credibility',
                'Funding ask and use of funds',
            ],
        });
    } finally {
        if (uploadedPath) {
            try {
                await fs.unlink(uploadedPath);
            } catch {
                // Ignore cleanup errors
            }
        }
    }
};

export const deriveDeckInsights = async (req: AuthRequest, res: Response) => {
    try {
        const userId = String(req.user?.id || '');
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user id.' });
        }
        const latest = await PitchDeckAnalysis.findOne({ user: userId } as any)
            .sort({ createdAt: -1 })
            .lean();

        if (!latest) {
            return res.status(404).json({ message: 'No pitch deck analysis found for this user.' });
        }

        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(503).json({ message: 'AI provider unavailable. Configure OPENROUTER_API_KEY.' });
        }

        const { contextText } = await getUserContext(userId);
        const prompt = `You are Ignisha. Using the pitch deck analysis and user profile, generate JSON cards for the platform features.

Return STRICT JSON with this shape:
{
  "summary": "string",
  "cards": [
    {"type": "businessValidator", "data": {"score": 0, "verdict": "string", "strengths": ["string"], "risks": ["string"], "nextSteps": ["string"]}},
    {"type": "financialProjection", "data": {"assumptions": ["string"], "projections": [{"year": "Year 1", "revenue": "string", "expenses": "string", "runway": "string"}]}},
    {"type": "competitorAnalysis", "data": {"competitors": [{"name": "string", "focus": "string", "edge": "string"}]}},
    {"type": "contentDraft", "data": {"title": "string", "hook": "string", "outline": ["string"], "cta": "string"}},
    {"type": "templatePack", "data": {"templates": [{"name": "string", "type": "string", "tier": "Free"}]}}
  ]
}

Rules:
- Use the pitch deck analysis to inform all outputs.
- Keep responses concise and investor-grade.
- Output JSON only.`;

        const aiResponse = await callOpenRouterJson([
            { role: 'system', content: prompt },
            {
                role: 'user',
                content: `${contextText}\n\nPitch deck analysis:\n${JSON.stringify(latest.analysis)}`,
            },
        ]);

        if (!aiResponse || !aiResponse.cards) {
            return res.status(502).json({ message: 'AI response unavailable.' });
        }

        res.json(aiResponse);
    } catch (error: any) {
        console.error('Deck insights error:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Failed to derive deck insights.' });
    }
};

// New: AI Chat endpoint for the Ignisha AI Dashboard
export const aiChat = async (req: AuthRequest, res: Response) => {
    try {
        const { message, conversationHistory } = req.body;
        const { contextText } = await getUserContext(String(req.user?.id));

        const messages = [
            {
                role: 'system',
                content: `You are Ignisha, an expert AI startup strategist for the NextIgnition platform. You help founders with business strategy, growth tactics, fundraising advice, market analysis, team building, and product development. Be insightful, actionable, and encouraging. Use markdown formatting and relevant emojis. Keep responses concise but comprehensive.\n\n${contextText}`
            },
            ...(conversationHistory || []),
            { role: 'user', content: message }
        ];

        const aiResponse = await callTextModelWithFallback(messages);
        if (!aiResponse || !String(aiResponse).trim()) {
            return res.status(502).json({ message: 'AI provider returned an empty response.' });
        }
        res.json({ response: aiResponse });
    } catch (error: any) {
        console.error('AI Chat Error:', error?.response?.data || error.message);
        res.status(500).json({ message: 'AI chat failed' });
    }
};

export const aiQuickAction = async (req: AuthRequest, res: Response) => {
    try {
        const { action, context } = req.body || {};
        if (!action) {
            return res.status(400).json({ message: 'Action is required.' });
        }

        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(503).json({ message: 'AI provider unavailable. Configure OPENROUTER_API_KEY.' });
        }

        const { contextText } = await getUserContext(String(req.user?.id));
        const baseContext = `${contextText}\n\nAdditional context: ${context || 'N/A'}`;

        const actionMap: Record<string, { type: string; prompt: string }> = {
            validator: {
                type: 'businessValidator',
                prompt: `Return STRICT JSON with shape:\n{\n  "score": 0,\n  "verdict": "string",\n  "strengths": ["string"],\n  "risks": ["string"],\n  "nextSteps": ["string"]\n}\nAnalyze the startup idea and output the JSON only.`
            },
            financial: {
                type: 'financialProjection',
                prompt: `Return STRICT JSON with shape:\n{\n  "assumptions": ["string"],\n  "projections": [\n    {"year": "Year 1", "revenue": "string", "expenses": "string", "runway": "string"}\n  ]\n}\nProvide a realistic early-stage 3-year projection. JSON only.`
            },
            competitor: {
                type: 'competitorAnalysis',
                prompt: `Return STRICT JSON with shape:\n{\n  "competitors": [\n    {"name": "string", "focus": "string", "edge": "string"}\n  ]\n}\nList 3-5 relevant competitors. JSON only.`
            },
            content: {
                type: 'contentDraft',
                prompt: `Return STRICT JSON with shape:\n{\n  "title": "string",\n  "hook": "string",\n  "outline": ["string"],\n  "cta": "string"\n}\nGenerate a founder-facing LinkedIn post outline. JSON only.`
            },
            template: {
                type: 'templatePack',
                prompt: `Return STRICT JSON with shape:\n{\n  "templates": [\n    {"name": "string", "type": "string", "tier": "Free"}\n  ]\n}\nProvide 4-6 template suggestions. JSON only.`
            },
        };

        if (!actionMap[action]) {
            return res.status(400).json({ message: 'Unknown action.' });
        }

        const { type, prompt } = actionMap[action];
        const aiTextResponse = await callTextModelWithFallback([
            {
                role: 'system',
                content: `You are Ignisha, an expert startup strategist. ${prompt}`,
            },
            {
                role: 'user',
                content: baseContext,
            },
        ]);

        const aiResponse = aiTextResponse ? parseJsonFromText(aiTextResponse) : null;

        if (!aiResponse) {
            return res.status(502).json({ message: 'AI response unavailable.' });
        }

        res.json({ type, data: aiResponse });
    } catch (error: any) {
        console.error('AI Quick Action Error:', error?.response?.data || error.message);
        res.status(500).json({ message: 'AI quick action failed' });
    }
};

export const matchCofounders = async (req: AuthRequest, res: Response) => {
    try {
        const { skills, location, commitment, startupStatus } = req.body || {};
        const { user, contextText } = await getUserContext(String(req.user?.id));

        const filter: any = { isActive: true };
        if (commitment) filter.commitment = commitment;
        if (startupStatus && startupStatus !== 'all') filter.startupStatus = startupStatus;
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (skills && Array.isArray(skills) && skills.length > 0) {
            filter.skills = { $in: skills };
        }

        const profiles = await CofounderProfile.find(filter)
            .populate('user', 'name avatar role profile')
            .sort({ updatedAt: -1 })
            .limit(20)
            .lean();

        const userSkills = normalizeArray(user?.profile?.skills || []);
        const userInterests = normalizeArray(user?.profile?.interests || []);

        const matches = profiles.map((profile: any) => {
            const profileSkills = normalizeArray(profile.skills || []);
            const profileStrengths = normalizeArray(profile.strengths || []);
            const score = 6 +
                computeMatchScore(userSkills, profileSkills) * 0.8 +
                computeMatchScore(userInterests, profileStrengths) * 0.4 +
                (location && profile.location && profile.location.toLowerCase().includes(String(location).toLowerCase()) ? 0.8 : 0) +
                (commitment && profile.commitment === commitment ? 0.6 : 0);

            const matchScore = Math.min(10, Math.max(0, Math.round(score * 10) / 10));
            const topSkills = profileSkills.slice(0, 3);
            return {
                id: profile.user?._id,
                name: profile.user?.name,
                avatar: profile.user?.avatar,
                role: profile.currentRole || profile.user?.role,
                location: profile.location || profile.user?.profile?.location,
                matchScore,
                skills: topSkills,
                reason: profile.vision || profile.lookingFor || 'Aligned on goals and skills.'
            };
        }).sort((a, b) => b.matchScore - a.matchScore);

        let summary = 'Top co-founder matches based on your profile.';
        if (process.env.OPENROUTER_API_KEY && matches.length > 0) {
            const summaryResponse = await callOpenRouter([
                {
                    role: 'system',
                    content: 'Summarize why these co-founders match the user in 2 sentences.'
                },
                {
                    role: 'user',
                    content: `${contextText}\n\nMatches:\n${JSON.stringify(matches.slice(0, 5))}`
                }
            ], getOpenRouterTextModel());
            if (summaryResponse) summary = summaryResponse;
        }

        res.json({ type: 'cofounderMatches', matches, summary });
    } catch (error: any) {
        console.error('Cofounder matching failed:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Cofounder matching failed' });
    }
};

export const matchClients = async (req: AuthRequest, res: Response) => {
    try {
        const { industry, stage } = req.body || {};
        const { user, contextText } = await getUserContext(String(req.user?.id));

        const filter: any = {};
        if (industry) filter.industry = { $regex: industry, $options: 'i' };
        if (stage) filter.stage = stage;

        const startups = await Startup.find(filter)
            .populate('founder', 'name avatar profile')
            .sort({ updatedAt: -1 })
            .limit(20)
            .lean();

        const expertise = normalizeArray(user?.profile?.expertise || []);
        const skills = normalizeArray(user?.profile?.skills || []);

        const matches = startups.map((startup: any) => {
            const industryTokens = normalizeArray(startup.industry ? [startup.industry] : []);
            const overlapScore = computeMatchScore(industryTokens, [...expertise, ...skills]);
            const score = Math.min(10, Math.max(0, 6 + overlapScore * 0.8));
            return {
                id: startup._id,
                name: startup.name,
                stage: startup.stage,
                location: startup.location,
                budget: startup.funding?.target ? `$${startup.funding.target.toLocaleString()} target` : 'Budget TBD',
                need: startup.description,
                matchScore: Math.round(score * 10) / 10,
            };
        }).sort((a, b) => b.matchScore - a.matchScore);

        let summary = 'Top client opportunities matched to your expertise.';
        if (process.env.OPENROUTER_API_KEY && matches.length > 0) {
            const summaryResponse = await callOpenRouter([
                {
                    role: 'system',
                    content: 'Summarize why these startups could be strong client matches in 2 sentences.'
                },
                {
                    role: 'user',
                    content: `${contextText}\n\nMatches:\n${JSON.stringify(matches.slice(0, 5))}`
                }
            ], getOpenRouterTextModel());
            if (summaryResponse) summary = summaryResponse;
        }

        res.json({ type: 'clientMatches', matches, summary });
    } catch (error: any) {
        console.error('Client matching failed:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Client matching failed' });
    }
};

// New: Expert matching AI
export const matchExperts = async (req: AuthRequest, res: Response) => {
    try {
        const { needs, industry, stage } = req.body;
        const { contextText } = await getUserContext(String(req.user?.id));

        const experts = await User.find({ $or: [{ role: 'expert' }, { roles: 'expert' }] })
            .select('name avatar role profile')
            .limit(30)
            .lean();

        const needTokens = normalizeArray(String(needs || industry || '').split(/[\s,]+/).filter(Boolean));

        const matches = experts.map((expert: any) => {
            const expertise = normalizeArray(expert.profile?.expertise || []);
            const skills = normalizeArray(expert.profile?.skills || []);
            const overlapScore = computeMatchScore(needTokens, [...expertise, ...skills]);
            const score = Math.min(10, Math.max(0, 6 + overlapScore * 0.8));
            return {
                id: expert._id,
                name: expert.name,
                avatar: expert.avatar,
                specialty: expertise[0] || 'Startup advisory',
                location: expert.profile?.location,
                rating: 4.5 + Math.min(0.5, overlapScore * 0.1),
                highlights: expertise.slice(0, 3),
                matchScore: Math.round(score * 10) / 10,
            };
        }).sort((a, b) => b.matchScore - a.matchScore);

        let summary = 'Top experts matched to your needs.';
        if (process.env.OPENROUTER_API_KEY && matches.length > 0) {
            const summaryResponse = await callOpenRouter([
                {
                    role: 'system',
                    content: 'Summarize why these experts fit the user in 2 sentences.'
                },
                {
                    role: 'user',
                    content: `${contextText}\n\nNeeds: ${needs || 'N/A'}\nMatches:\n${JSON.stringify(matches.slice(0, 5))}`
                }
            ], getOpenRouterTextModel());
            if (summaryResponse) summary = summaryResponse;
        }

        res.json({ type: 'expertMatches', matches, summary });
    } catch (error: any) {
        res.status(500).json({ message: 'Expert matching failed' });
    }
};
