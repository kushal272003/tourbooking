import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const tourService = {
    // All tours (public - no auth)
    getAllTours: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tours`);
            return response.data;
        } catch (error) {
            console.error('Error fetching tours:', error);
            throw error;
        }
    },

    // Tour by ID (public - no auth)
    getTourById: async (id) => {
        try {
            console.log('Fetching tour:', id);
            const response = await axios.get(`${API_BASE_URL}/tours/${id}`);
            console.log('Tour response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching tour:', error.response || error);
            throw error;
        }
    },

    // Other methods remain same
    getToursByDestination: async (destination) => {
        const response = await axios.get(`${API_BASE_URL}/tours/destination/${destination}`);
        return response.data;
    },

    getToursByPriceRange: async (minPrice, maxPrice) => {
        const response = await axios.get(`${API_BASE_URL}/tours/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`);
        return response.data;
    },

    getAvailableTours: async () => {
        const response = await axios.get(`${API_BASE_URL}/tours/available`);
        return response.data;
    },

    getUpcomingTours: async () => {
        const response = await axios.get(`${API_BASE_URL}/tours/upcoming`);
        return response.data;
    },

    searchTours: async (keyword) => {
        const response = await axios.get(`${API_BASE_URL}/tours/search?keyword=${keyword}`);
        return response.data;
    },

    // Admin methods (need auth)
    createTour: async (tourData) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/tours`, tourData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    },

    updateTour: async (id, tourData) => {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_BASE_URL}/tours/${id}`, tourData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    },

    deleteTour: async (id) => {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_BASE_URL}/tours/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }
};

export default tourService;