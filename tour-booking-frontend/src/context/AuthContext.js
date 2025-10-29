import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Page load pe check kar user logged in hai ya nahi
        const currentUser = authService.getCurrentUser();
        if (currentUser && authService.isLoggedIn()) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setUser(data.user);
        return data;
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const isAdmin = () => {
        return user?.role === 'ADMIN';
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};