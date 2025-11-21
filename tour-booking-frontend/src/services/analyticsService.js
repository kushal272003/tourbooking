// src/services/analyticsService.js
import api from './api';

const analyticsService = {
    // Get analytics data with period filter
    getAnalytics: async (period = 'monthly') => {
        try {
            const response = await api.get(`/analytics?period=${period}`);
            console.log('Analytics data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Analytics error:', error);
            throw error;
        }
    }
};

export default analyticsService;