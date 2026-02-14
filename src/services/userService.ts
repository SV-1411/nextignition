import api from './api';

export const getProfile = async (userId: string) => {
    const response = await api.get(`/auth/profile/${userId}`);
    return response.data;
};

export const updateProfile = async (profileData: any) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
};

export const getExpertStats = async () => {
    const response = await api.get('/auth/expert-stats');
    return response.data;
};

export const getFounderStats = async () => {
    const response = await api.get('/auth/founder-stats');
    return response.data;
};
