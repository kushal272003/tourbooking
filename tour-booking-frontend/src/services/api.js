import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('🔑 Token:', token ? 'Present' : 'Missing'); // Debug log
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('📤 Request:', config.method.toUpperCase(), config.url); // Debug log
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('✅ Response:', response.status, response.config.url); // Debug log
        return response;
    },
    (error) => {
        console.error('❌ Response Error:', error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;