import api from './api';

export const generateSummary = async (idea: string) => {
    const response = await api.post('/ai/summary', { idea });
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
