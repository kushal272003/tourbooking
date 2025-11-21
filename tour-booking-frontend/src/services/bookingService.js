// src/services/bookingService.js
import api from './api';

const bookingService = {

    // ✅ UPDATED: New Booking Structure (Primary + Additional)
    createBooking: async (bookingPayload) => {
        try {
            console.log("🔵 Sending booking request with NEW structure...");
            console.log("📦 Original Payload:", JSON.stringify(bookingPayload, null, 2));
            
            // ✅ Validate payload structure
            if (!bookingPayload.contactEmail || !bookingPayload.contactPhone) {
                throw new Error("Contact email and phone are required");
            }

            if (!bookingPayload.primaryPassenger) {
                throw new Error("Primary passenger details are required");
            }

            // ✅ Format Primary Passenger
            const primaryPassenger = {
                name: bookingPayload.primaryPassenger.name,
                age: parseInt(bookingPayload.primaryPassenger.age),
                gender: bookingPayload.primaryPassenger.gender,
                idProof: bookingPayload.primaryPassenger.idProof
            };

            // ✅ Format Additional Passengers
            const additionalPassengers = (bookingPayload.additionalPassengers || []).map(p => ({
                name: p.name,
                age: parseInt(p.age),
                gender: p.gender || null,
                idProof: p.idProof || null  // Can be empty/null
            }));

            // ✅ Create final payload matching BookingRequest DTO
            const payload = {
                userId: bookingPayload.userId,
                tourId: bookingPayload.tourId,
                numberOfSeats: bookingPayload.numberOfSeats,
                contactEmail: bookingPayload.contactEmail,
                contactPhone: bookingPayload.contactPhone,
                primaryPassenger: primaryPassenger,
                additionalPassengers: additionalPassengers
            };
            
            console.log("📤 Final API Payload:", JSON.stringify(payload, null, 2));

            const response = await api.post('/bookings', payload);

            console.log("✅ Booking created successfully:", response.data);
            return response.data;  // Returns BookingResponse DTO

        } catch (error) {
            console.error("🔴 Booking creation failed!");
            console.error("🔴 Error:", error.message);
            console.error("🔴 Response data:", error.response?.data);
            console.error("🔴 Response status:", error.response?.status);
            
            // Throw detailed error
            if (error.response?.data) {
                throw new Error(error.response.data.message || JSON.stringify(error.response.data));
            }
            throw error;
        }
    },

    // Get all bookings
    getAllBookings: async () => {
        try {
            const response = await api.get('/bookings');
            return response.data;  // Returns List<BookingResponse>
        } catch (error) {
            console.error("Error fetching all bookings:", error);
            throw error;
        }
    },

    // Get booking by ID
    getBookingById: async (id) => {
        try {
            const response = await api.get(`/bookings/${id}`);
            return response.data;  // Returns BookingResponse
        } catch (error) {
            console.error("Error fetching booking:", error);
            throw error;
        }
    },

    // Get user bookings
    getUserBookings: async (userId) => {
        try {
            const response = await api.get(`/bookings/user/${userId}`);
            return response.data;  // Returns List<BookingResponse>
        } catch (error) {
            console.error("Error fetching user bookings:", error);
            throw error;
        }
    },

    // Get tour bookings
    getTourBookings: async (tourId) => {
        try {
            const response = await api.get(`/bookings/tour/${tourId}`);
            return response.data;  // Returns List<BookingResponse>
        } catch (error) {
            console.error("Error fetching tour bookings:", error);
            throw error;
        }
    },

    // Get bookings by status
    getBookingsByStatus: async (status) => {
        try {
            const response = await api.get(`/bookings/status/${status}`);
            return response.data;  // Returns List<BookingResponse>
        } catch (error) {
            console.error("Error fetching bookings by status:", error);
            throw error;
        }
    },

    // Confirm booking (after payment)
    confirmBooking: async (id) => {
        try {
            const response = await api.put(`/bookings/${id}/confirm`);
            console.log("✅ Booking confirmed:", response.data);
            return response.data;  // Returns BookingResponse
        } catch (error) {
            console.error("Error confirming booking:", error);
            throw error;
        }
    },

    // Cancel booking
    cancelBooking: async (id) => {
        try {
            const response = await api.put(`/bookings/${id}/cancel`);
            console.log("✅ Booking cancelled:", response.data);
            return response.data;  // Returns BookingResponse
        } catch (error) {
            console.error("Error cancelling booking:", error);
            throw error;
        }
    },

    // Complete booking
    completeBooking: async (id) => {
        try {
            const response = await api.put(`/bookings/${id}/complete`);
            console.log("✅ Booking completed:", response.data);
            return response.data;  // Returns BookingResponse
        } catch (error) {
            console.error("Error completing booking:", error);
            throw error;
        }
    },

    // Delete booking
    deleteBooking: async (id) => {
        try {
            const response = await api.delete(`/bookings/${id}`);
            console.log("✅ Booking deleted");
            return response.data;
        } catch (error) {
            console.error("Error deleting booking:", error);
            throw error;
        }
    }
};

export default bookingService;