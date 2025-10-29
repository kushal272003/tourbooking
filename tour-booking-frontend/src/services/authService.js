import api from './api';
import {jwtDecode} from 'jwt-decode';

const authService = {
    // User registration
    register: async (userData) => {
        const response = await api.post('/users/register', userData);
        return response.data;
    },

    // User login
    login: async (email, password) => {
        const response = await api.post('/users/login', { email, password });
        
        if (response.data.token) {
            // Token save karna
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    },

    // Get user profile
getProfile: async (userId) => {
    const response = await api.get(`/users/profile/${userId}`);
    return response.data;
},

// Update profile
updateProfile: async (userId, data) => {
    const response = await api.put(`/users/profile/${userId}`, data);
    // Update localStorage
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
},

// Change password
changePassword: async (userId, currentPassword, newPassword) => {
    const response = await api.put(`/users/change-password/${userId}`, {
        currentPassword,
        newPassword
    });
    return response.data;
},

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is logged in
    isLoggedIn: () => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const decoded = jwtDecode(token);
            // Check if token expired
            return decoded.exp * 1000 > Date.now();
        } catch (error) {
            return false;
        }
    },

    // Check if user is admin
    isAdmin: () => {
        const user = authService.getCurrentUser();
        return user?.role === 'ADMIN';
    },

    // Get token
    getToken: () => {
        return localStorage.getItem('token');
    }
};

export default authService;