import api from './api';

export const createStartup = async (startupData: any) => {
    const response = await api.post('/startups', startupData);
    return response.data;
};

export const getMyStartups = async () => {
    const response = await api.get('/startups/my');
    return response.data;
};

export const getAllStartups = async () => {
    const response = await api.get('/startups');
    return response.data;
};

export const updateStartup = async (id: string, startupData: any) => {
    const response = await api.put(`/startups/${id}`, startupData);
    return response.data;
};
