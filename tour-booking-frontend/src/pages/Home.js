import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>🎉 Welcome to Tour Booking!</h1>
            
            {isAuthenticated ? (
                <div>
                    <h2>Hello, {user.name}! 👋</h2>
                    <p>Email: {user.email}</p>
                    <p>Role: <strong>{user.role}</strong></p>
                    <button 
                        onClick={handleLogout}
                        style={{
                            padding: '10px 20px',
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '20px'
                        }}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div>
                    <p>Please login to continue</p>
                    <button onClick={() => navigate('/login')}>Go to Login</button>
                </div>
            )}
        </div>
    );
};

export default Home;