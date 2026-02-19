"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchExperts = exports.aiChat = exports.summarizePitchDeck = exports.summarizeProfile = exports.generateStartupSummary = void 0;
const axios_1 = __importDefault(require("axios"));
const promises_1 = __importDefault(require("fs/promises"));
// OpenRouter API - works with many models, much cheaper than direct OpenAI
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_OPENROUTER_MODEL = 'meta-llama/llama-3.1-8b-instruct:free';
const sanitizeEnvValue = (value) => {
    if (!value)
        return '';
    return value.trim().replace(/^['"`]+|['"`]+$/g, '').trim();
};
const normalizeMessagesForModel = (messages, omitSystemRole) => {
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
const callOpenRouter = async (messages, model, allowDefaultRetry = true, omitSystemRole = false) => {
    const apiKey = sanitizeEnvValue(process.env.OPENROUTER_API_KEY);
    if (!apiKey)
        return null;
    const targetModel = sanitizeEnvValue(model) || DEFAULT_OPENROUTER_MODEL;
    const payloadMessages = normalizeMessagesForModel(messages, omitSystemRole);
    try {
        const response = await axios_1.default.post(OPENROUTER_API_URL, {
            model: targetModel,
            messages: payloadMessages,
            max_tokens: 1024,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:3000',
                'X-Title': 'NextIgnition Platform',
            },
        });
        return response.data.choices[0].message.content;
    }
    catch (error) {
        const status = error?.response?.status;
        const providerCode = error?.response?.data?.error?.code;
        const providerMessage = String(error?.response?.data?.error?.message || '').toLowerCase();
        const providerRaw = String(error?.response?.data?.error?.metadata?.raw || '').toLowerCase();
        const modelInstructionUnsupported = providerMessage.includes('developer instruction is not enabled') ||
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
        if (status === 429 ||
            providerCode === 429 ||
            providerMessage.includes('rate-limit') ||
            providerMessage.includes('rate limited') ||
            providerRaw.includes('rate-limit') ||
            providerRaw.includes('rate limited')) {
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
const extractJsonFromText = (text) => {
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
const parseGeminiAnalysis = (text) => {
    try {
        const jsonStr = extractJsonFromText(text);
        const parsed = JSON.parse(jsonStr);
        return {
            summary: String(parsed.executiveSummary || parsed.summary || '').trim(),
            highlights: Array.isArray(parsed.highlights)
                ? parsed.highlights.map((item) => String(item)).filter(Boolean)
                : [],
            strengths: Array.isArray(parsed.strengths)
                ? parsed.strengths.map((item) => String(item)).filter(Boolean)
                : [],
            gaps: Array.isArray(parsed.gaps)
                ? parsed.gaps.map((item) => String(item)).filter(Boolean)
                : [],
            investorReadinessScore: typeof parsed.investorReadinessScore === 'number' ? parsed.investorReadinessScore : undefined,
            raw: text,
        };
    }
    catch {
        return {
            summary: text,
            highlights: [],
            raw: text,
        };
    }
};
const callGeminiWithFile = async (filePath, mimeType, prompt) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
        return null;
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const fileBuffer = await promises_1.default.readFile(filePath);
    const base64Data = fileBuffer.toString('base64');
    const response = await axios_1.default.post(`${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`, {
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
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 60000,
    });
    const text = response.data?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text)
        .filter(Boolean)
        .join('\n')
        ?.trim();
    if (!text) {
        throw new Error('Gemini returned an empty analysis response');
    }
    return text;
};
const callGeminiWithText = async (content, prompt) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
        return null;
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const response = await axios_1.default.post(`${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`, {
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
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 60000,
    });
    const text = response.data?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text)
        .filter(Boolean)
        .join('\n')
        ?.trim();
    if (!text) {
        throw new Error('Gemini returned an empty analysis response');
    }
    return text;
};
const stringifyUnknownOutput = (value) => {
    if (typeof value === 'string')
        return value;
    if (Array.isArray(value)) {
        return value
            .map((item) => {
            if (typeof item === 'string')
                return item;
            if (item && typeof item === 'object') {
                if (typeof item.text === 'string')
                    return item.text;
                if (typeof item.content === 'string')
                    return item.content;
            }
            try {
                return JSON.stringify(item);
            }
            catch {
                return String(item);
            }
        })
            .filter(Boolean)
            .join('\n');
    }
    if (value && typeof value === 'object') {
        if (typeof value.text === 'string')
            return value.text;
        if (typeof value.content === 'string')
            return value.content;
        try {
            return JSON.stringify(value);
        }
        catch {
            return String(value);
        }
    }
    return String(value ?? '');
};
const callBytez = async (messages) => {
    const apiKey = process.env.BYTEZ_API_KEY;
    if (!apiKey)
        return null;
    try {
        const moduleRef = require('bytez.js');
        const Bytez = moduleRef?.default || moduleRef;
        const sdk = new Bytez(apiKey);
        const modelName = process.env.BYTEZ_MODEL || 'google/gemini-2.5-pro';
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
    }
    catch (error) {
        console.error('Bytez call failed:', error?.message || error);
        return null;
    }
};
const generateStartupSummary = async (req, res) => {
    try {
        const { idea } = req.body;
        if (!process.env.OPENROUTER_API_KEY) {
            // Mock response if no API key
            return res.json({
                summary: `🚀 **Startup Analysis for: "${idea}"**\n\n**Market Opportunity:** This idea addresses a growing market need. With the right execution, there's significant potential for disruption.\n\n**Key Strengths:**\n• Innovative approach to solving a real problem\n• Scalable business model potential\n• Strong market timing\n\n**Recommendations:**\n1. Validate with 50+ potential customers\n2. Build an MVP within 3 months\n3. Focus on a single core metric\n4. Seek mentorship from domain experts\n\n*Note: Connect your OpenRouter API key for real AI-powered analysis.*`
            });
        }
        const aiResponse = await callOpenRouter([
            {
                role: 'system',
                content: 'You are an expert venture capitalist and startup strategist named Ignisha. Your goal is to transform complex startup ideas into compelling, investor-ready summaries. Be encouraging but realistic. Use emojis sparingly. Format with markdown.'
            },
            {
                role: 'user',
                content: `Please generate an investor-ready summary for this startup idea: ${idea}`
            }
        ]);
        res.json({ summary: aiResponse });
    }
    catch (error) {
        console.error('AI Error:', error?.response?.data || error.message);
        res.status(500).json({ message: 'AI Generation failed', error: error.message });
    }
};
exports.generateStartupSummary = generateStartupSummary;
const summarizeProfile = async (req, res) => {
    try {
        if (!process.env.OPENROUTER_API_KEY) {
            return res.json({
                summary: '🎯 **Profile Summary:** You are a passionate entrepreneur with great potential. Complete your profile to get a more detailed AI-powered analysis of your strengths and growth areas.'
            });
        }
        const { profile } = req.body;
        const aiResponse = await callOpenRouter([
            {
                role: 'system',
                content: 'You are a career advisor and startup mentor. Analyze the user profile and provide actionable insights about their strengths, areas for growth, and networking suggestions.'
            },
            {
                role: 'user',
                content: `Analyze this founder profile and give insights: ${JSON.stringify(profile)}`
            }
        ]);
        res.json({ summary: aiResponse });
    }
    catch (error) {
        console.error('AI Error:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Profile summarization failed' });
    }
};
exports.summarizeProfile = summarizeProfile;
const summarizePitchDeck = async (req, res) => {
    console.log('summarizePitchDeck hit:', {
        method: req.method,
        path: req.path,
        hasFile: !!req.file,
        contentLength: Number(req.headers['content-length'] || 0),
        contentType: req.headers['content-type'],
    });
    const file = req.file;
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
            const openRouterModel = sanitizeEnvValue(process.env.OPENROUTER_PITCH_DECK_MODEL) ||
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
            }
            else {
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
        return res.json(parsed);
    }
    catch (error) {
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
    }
    finally {
        if (uploadedPath) {
            try {
                await promises_1.default.unlink(uploadedPath);
            }
            catch {
                // Ignore cleanup errors
            }
        }
    }
};
exports.summarizePitchDeck = summarizePitchDeck;
// New: AI Chat endpoint for the Ignisha AI Dashboard
const aiChat = async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;
        if (!process.env.OPENROUTER_API_KEY) {
            // Smart mock responses based on keywords
            let mockResponse = '';
            const lowerMsg = message.toLowerCase();
            if (lowerMsg.includes('fund') || lowerMsg.includes('invest')) {
                mockResponse = '💰 **Funding Strategy Tips:**\n\n1. **Bootstrap Phase:** Start with personal savings or friends & family\n2. **Pre-Seed:** Angel investors ($50K-$500K)\n3. **Seed Round:** VCs targeting early-stage ($500K-$2M)\n4. **Prepare:** Strong pitch deck, clear metrics, and a solid team\n\nWant me to help you prepare your pitch deck?';
            }
            else if (lowerMsg.includes('market') || lowerMsg.includes('customer')) {
                mockResponse = '📊 **Market Research Framework:**\n\n1. **TAM/SAM/SOM Analysis** - Define your addressable market\n2. **Customer Discovery** - Talk to 100+ potential users\n3. **Competitor Mapping** - Identify gaps in existing solutions\n4. **Validation Metrics** - Set clear success criteria\n\nShall I help you build a customer persona?';
            }
            else if (lowerMsg.includes('team') || lowerMsg.includes('hire')) {
                mockResponse = '👥 **Team Building Advice:**\n\n1. **Core Roles:** Technical co-founder, sales/marketing, operations\n2. **Equity Split:** Use frameworks like the Slicing Pie model\n3. **Hiring Tips:** Hire for culture fit + skills, not just résumé\n4. **Advisory Board:** Get 2-3 industry experts\n\nNeed help creating a hiring plan?';
            }
            else {
                mockResponse = `Great question! As your AI strategist, here's my take on "${message}":\n\n🔑 **Key Insight:** Every successful startup needs clarity of vision, rapid iteration, and customer obsession.\n\n**Next Steps:**\n1. Define your core value proposition\n2. Identify your ideal customer profile\n3. Build a lean MVP\n4. Measure, learn, iterate\n\n*Connect your OpenRouter API key in .env for more detailed, personalized advice.*`;
            }
            return res.json({ response: mockResponse });
        }
        const messages = [
            {
                role: 'system',
                content: 'You are Ignisha, an expert AI startup strategist for the NextIgnition platform. You help founders with business strategy, growth tactics, fundraising advice, market analysis, team building, and product development. Be insightful, actionable, and encouraging. Use markdown formatting and relevant emojis. Keep responses concise but comprehensive.'
            },
            ...(conversationHistory || []),
            { role: 'user', content: message }
        ];
        const aiResponse = await callOpenRouter(messages);
        res.json({ response: aiResponse });
    }
    catch (error) {
        console.error('AI Chat Error:', error?.response?.data || error.message);
        res.status(500).json({ message: 'AI chat failed' });
    }
};
exports.aiChat = aiChat;
// New: Expert matching AI
const matchExperts = async (req, res) => {
    try {
        const { needs, industry, stage } = req.body;
        if (!process.env.OPENROUTER_API_KEY) {
            return res.json({
                suggestions: [
                    { area: 'Growth Marketing', reason: 'Essential for early traction', priority: 'high' },
                    { area: 'Technical Architecture', reason: 'Scalable foundation', priority: 'medium' },
                    { area: 'Fundraising Strategy', reason: 'Prepare for next round', priority: 'high' },
                ],
                summary: 'Based on your startup profile, I recommend connecting with experts in these areas. Connect your API key for personalized matching.'
            });
        }
        const aiResponse = await callOpenRouter([
            {
                role: 'system',
                content: 'You are an expert matchmaker for startups. Based on the founders needs, suggest types of experts and mentors. Return a JSON with suggestions array (area, reason, priority) and summary.'
            },
            {
                role: 'user',
                content: `Match experts for: Needs: ${needs}, Industry: ${industry}, Stage: ${stage}`
            }
        ]);
        res.json({ suggestions: aiResponse });
    }
    catch (error) {
        res.status(500).json({ message: 'Expert matching failed' });
    }
};
exports.matchExperts = matchExperts;
