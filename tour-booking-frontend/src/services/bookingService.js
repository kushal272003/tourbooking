import api from './api';

const bookingService = {
    // Create booking (authenticated)
    createBooking: async (userId, tourId, numberOfSeats) => {
        try {
            console.log('Creating booking:', { userId, tourId, numberOfSeats }); // Debug
            const response = await api.post(`/bookings?userId=${userId}&tourId=${tourId}&numberOfSeats=${numberOfSeats}`);
            console.log('Booking created:', response.data); // Debug
            return response.data;
        } catch (error) {
            console.error('Booking error:', error.response || error); // Debug
            throw error;
        }
    },

    // Get all bookings
    getAllBookings: async () => {
        const response = await api.get('/bookings');
        return response.data;
    },

    // Get booking by ID
    getBookingById: async (id) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    // Get user's bookings
    getUserBookings: async (userId) => {
        try {
            console.log('Fetching bookings for user:', userId); // Debug
            const response = await api.get(`/bookings/user/${userId}`);
            console.log('User bookings:', response.data); // Debug
            return response.data;
        } catch (error) {
            console.error('Error fetching user bookings:', error); // Debug
            throw error;
        }
    },

    // Get tour's bookings
    getTourBookings: async (tourId) => {
        const response = await api.get(`/bookings/tour/${tourId}`);
        return response.data;
    },

    // Get bookings by status
    getBookingsByStatus: async (status) => {
        const response = await api.get(`/bookings/status/${status}`);
        return response.data;
    },

    // Confirm booking
    confirmBooking: async (id) => {
        const response = await api.put(`/bookings/${id}/confirm`);
        return response.data;
    },

    // Cancel booking
    cancelBooking: async (id) => {
        const response = await api.put(`/bookings/${id}/cancel`);
        return response.data;
    },

    // Complete booking
    completeBooking: async (id) => {
        const response = await api.put(`/bookings/${id}/complete`);
        return response.data;
    },

    // Delete booking
    deleteBooking: async (id) => {
        const response = await api.delete(`/bookings/${id}`);
        return response.data;
    }
};

export default bookingService;