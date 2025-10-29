import api from './api';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const reviewService = {
    // Create review (authenticated)
    createReview: async (tourId, userId, rating, comment, bookingId = null) => {
        try {
            let url = `/reviews?tourId=${tourId}&userId=${userId}&rating=${rating}&comment=${encodeURIComponent(comment)}`;
            if (bookingId) {
                url += `&bookingId=${bookingId}`;
            }
            const response = await api.post(url);
            return response.data;
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    },

    // Get all reviews
    getAllReviews: async () => {
        const response = await axios.get(`${API_BASE_URL}/reviews`);
        return response.data;
    },

    // Get review by ID
    getReviewById: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/reviews/${id}`);
        return response.data;
    },

    // Get reviews for a tour (public)
    getTourReviews: async (tourId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reviews/tour/${tourId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching tour reviews:', error);
            throw error;
        }
    },

    // Get reviews by user
    getUserReviews: async (userId) => {
        const response = await api.get(`/reviews/user/${userId}`);
        return response.data;
    },

    // Get tour rating stats
    getTourRatingStats: async (tourId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reviews/stats/tour/${tourId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching rating stats:', error);
            return { averageRating: 0, totalReviews: 0 };
        }
    },

    // Update review
    updateReview: async (reviewId, userId, rating, comment) => {
        const response = await api.put(`/reviews/${reviewId}?userId=${userId}&rating=${rating}&comment=${encodeURIComponent(comment)}`);
        return response.data;
    },

    // Delete review
    deleteReview: async (reviewId, userId, isAdmin = false) => {
        const response = await api.delete(`/reviews/${reviewId}?userId=${userId}&isAdmin=${isAdmin}`);
        return response.data;
    }
};

export default reviewService;