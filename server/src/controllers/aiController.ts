import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import axios from 'axios';

// OpenRouter API - works with many models, much cheaper than direct OpenAI
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const callOpenRouter = async (messages: { role: string; content: string }[], model?: string) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return null;

    const response = await axios.post(
        OPENROUTER_API_URL,
        {
            model: model || 'meta-llama/llama-3.1-8b-instruct:free', // Free model
            messages,
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
};

export const generateStartupSummary = async (req: AuthRequest, res: Response) => {
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
    } catch (error: any) {
        console.error('AI Error:', error?.response?.data || error.message);
        res.status(500).json({ message: 'AI Generation failed', error: error.message });
    }
};

export const summarizeProfile = async (req: AuthRequest, res: Response) => {
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
    } catch (error: any) {
        console.error('AI Error:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Profile summarization failed' });
    }
};

export const summarizePitchDeck = async (req: AuthRequest, res: Response) => {
    try {
        // TODO: Implement PDF parsing (e.g., with pdf-parse)
        // For now, accept text content
        const { content } = req.body;

        if (!process.env.OPENROUTER_API_KEY) {
            return res.json({
                summary: '📊 **Pitch Deck Analysis:** Upload your pitch deck content and connect your OpenRouter API key for a detailed AI analysis covering market opportunity, team strength, financial projections, and investor readiness.'
            });
        }

        const aiResponse = await callOpenRouter([
            {
                role: 'system',
                content: 'You are an expert pitch deck analyst. Analyze pitch decks and provide structured feedback on: Problem/Solution fit, Market size, Business model, Team strength, Ask/Use of funds, and overall investor-readiness score.'
            },
            {
                role: 'user',
                content: `Analyze this pitch deck content: ${content}`
            }
        ]);

        res.json({ summary: aiResponse });
    } catch (error: any) {
        console.error('AI Error:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Pitch deck analysis failed' });
    }
};

// New: AI Chat endpoint for the Ignisha AI Dashboard
export const aiChat = async (req: AuthRequest, res: Response) => {
    try {
        const { message, conversationHistory } = req.body;

        if (!process.env.OPENROUTER_API_KEY) {
            // Smart mock responses based on keywords
            let mockResponse = '';
            const lowerMsg = message.toLowerCase();

            if (lowerMsg.includes('fund') || lowerMsg.includes('invest')) {
                mockResponse = '💰 **Funding Strategy Tips:**\n\n1. **Bootstrap Phase:** Start with personal savings or friends & family\n2. **Pre-Seed:** Angel investors ($50K-$500K)\n3. **Seed Round:** VCs targeting early-stage ($500K-$2M)\n4. **Prepare:** Strong pitch deck, clear metrics, and a solid team\n\nWant me to help you prepare your pitch deck?';
            } else if (lowerMsg.includes('market') || lowerMsg.includes('customer')) {
                mockResponse = '📊 **Market Research Framework:**\n\n1. **TAM/SAM/SOM Analysis** - Define your addressable market\n2. **Customer Discovery** - Talk to 100+ potential users\n3. **Competitor Mapping** - Identify gaps in existing solutions\n4. **Validation Metrics** - Set clear success criteria\n\nShall I help you build a customer persona?';
            } else if (lowerMsg.includes('team') || lowerMsg.includes('hire')) {
                mockResponse = '👥 **Team Building Advice:**\n\n1. **Core Roles:** Technical co-founder, sales/marketing, operations\n2. **Equity Split:** Use frameworks like the Slicing Pie model\n3. **Hiring Tips:** Hire for culture fit + skills, not just résumé\n4. **Advisory Board:** Get 2-3 industry experts\n\nNeed help creating a hiring plan?';
            } else {
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
    } catch (error: any) {
        console.error('AI Chat Error:', error?.response?.data || error.message);
        res.status(500).json({ message: 'AI chat failed' });
    }
};

// New: Expert matching AI
export const matchExperts = async (req: AuthRequest, res: Response) => {
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
    } catch (error: any) {
        res.status(500).json({ message: 'Expert matching failed' });
    }
};
