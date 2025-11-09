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
    },
     advancedSearch: async (filters) => {
        try {
            // Build query parameters
            const params = new URLSearchParams();

            if (filters.keyword) params.append('keyword', filters.keyword);
            if (filters.minPrice !== null && filters.minPrice !== undefined) 
                params.append('minPrice', filters.minPrice);
            if (filters.maxPrice !== null && filters.maxPrice !== undefined) 
                params.append('maxPrice', filters.maxPrice);
            if (filters.minDuration !== null && filters.minDuration !== undefined) 
                params.append('minDuration', filters.minDuration);
            if (filters.maxDuration !== null && filters.maxDuration !== undefined) 
                params.append('maxDuration', filters.maxDuration);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.availableOnly) params.append('availableOnly', filters.availableOnly);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);

            const response = await axios.get(
                `${API_BASE_URL}/tours/advanced-search?${params.toString()}`
            );
            
            console.log('Advanced search response:', response.data);
            return response.data;

        } catch (error) {
            console.error('Error in advanced search:', error);
            throw error;
        }
    },

    /**
     * Get price range (min and max) for slider
     * @returns {Promise<Object>} - { minPrice, maxPrice }
     */
    getPriceRange: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tours/price-range-data`);
            return response.data;
        } catch (error) {
            console.error('Error fetching price range:', error);
            return { minPrice: 0, maxPrice: 100000 }; // Default fallback
        }
    },

    /**
     * Get all unique destinations for dropdown
     * @returns {Promise<Array>} - Array of destination strings
     */
    getAllDestinations: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tours/destinations`);
            return response.data;
        } catch (error) {
            console.error('Error fetching destinations:', error);
            return [];
        }
    },


    getToursByCategory: async (category) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tours/category/${category}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching tours by category (${category}):`, error);
        throw error;
    }
},



    /**
     * Get tours by duration range
     * @param {number} minDuration - Minimum duration
     * @param {number} maxDuration - Maximum duration
     * @returns {Promise<Array>} - Array of tours
     */
    getToursByDurationRange: async (minDuration, maxDuration) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/tours/duration-range?minDuration=${minDuration}&maxDuration=${maxDuration}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching tours by duration:', error);
            throw error;
        }
    },

    /**
     * Get tours by date range
     * @param {string} startDate - Start date (yyyy-MM-dd)
     * @param {string} endDate - End date (yyyy-MM-dd)
     * @returns {Promise<Array>} - Array of tours
     */
    getToursByDateRange: async (startDate, endDate) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/tours/date-range?startDate=${startDate}&endDate=${endDate}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching tours by date range:', error);
            throw error;
        }
    }

};

export default tourService;