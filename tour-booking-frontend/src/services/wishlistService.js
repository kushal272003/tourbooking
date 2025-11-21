import api from './api';

const wishlistService = {
    // Add to wishlist
    addToWishlist: async (userId, tourId) => {
        try {
            const response = await api.post(`/wishlist?userId=${userId}&tourId=${tourId}`);
            return response.data;
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            throw error;
        }
    },

    // Remove from wishlist
    removeFromWishlist: async (userId, tourId) => {
        try {
            const response = await api.delete(`/wishlist?userId=${userId}&tourId=${tourId}`);
            return response.data;
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            throw error;
        }
    },

    // Get user's wishlist
    getUserWishlist: async (userId) => {
        try {
            const response = await api.get(`/wishlist/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            throw error;
        }
    },

    // Check if tour is in wishlist
    checkWishlist: async (userId, tourId) => {
        try {
            const response = await api.get(`/wishlist/check?userId=${userId}&tourId=${tourId}`);
            return response.data.isInWishlist;
        } catch (error) {
            console.error('Error checking wishlist:', error);
            return false;
        }
    },

    // Get wishlist count
    getWishlistCount: async (userId) => {
        try {
            const response = await api.get(`/wishlist/count/${userId}`);
            return response.data.count;
        } catch (error) {
            console.error('Error fetching wishlist count:', error);
            return 0;
        }
    },

    // Clear wishlist
    clearWishlist: async (userId) => {
        try {
            const response = await api.delete(`/wishlist/clear/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            throw error;
        }
    }
};

export default wishlistService;