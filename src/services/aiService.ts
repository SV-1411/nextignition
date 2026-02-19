import api from './api';

export const generateSummary = async (idea: string) => {
    const response = await api.post('/ai/summary', { idea });
    return response.data;
};

export const aiChat = async (message: string, conversationHistory?: { role: string; content: string }[]) => {
    const response = await api.post('/ai/chat', { message, conversationHistory });
    return response.data;
};

export const summarizeUserProfile = async () => {
    const response = await api.post('/ai/profile');
    return response.data;
};

export const analyzePitchDeck = async (file: File) => {
    const formData = new FormData();
    formData.append('pitchDeck', file);
    const response = await api.post('/ai/pitch-deck', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const runQuickAction = async (action: string, context?: string) => {
    const response = await api.post('/ai/quick-action', { action, context });
    return response.data;
};

export const matchCofounders = async (payload?: {
    skills?: string[];
    location?: string;
    commitment?: string;
    startupStatus?: string;
}) => {
    const response = await api.post('/ai/match-cofounders', payload || {});
    return response.data;
};

export const matchExperts = async (payload?: {
    needs?: string;
    industry?: string;
    stage?: string;
}) => {
    const response = await api.post('/ai/match-experts', payload || {});
    return response.data;
};

export const matchClients = async (payload?: {
    industry?: string;
    stage?: string;
}) => {
    const response = await api.post('/ai/match-clients', payload || {});
    return response.data;
};

export const fetchDeckInsights = async () => {
    const response = await api.post('/ai/deck-insights');
    return response.data;
};
