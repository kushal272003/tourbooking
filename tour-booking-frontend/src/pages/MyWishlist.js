import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import wishlistService from '../services/wishlistService';
import { 
    FaHeart, 
    FaTrash, 
    FaShoppingCart,
    FaMapMarkerAlt,
    FaClock,
    FaRupeeSign
} from 'react-icons/fa';
import '../assets/MyWishlist.css';

const MyWishlist = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchWishlist();
    }, [isAuthenticated, user]);

    const fetchWishlist = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await wishlistService.getUserWishlist(user.id);
            setWishlist(data);
        } catch (err) {
            setError('Failed to load wishlist');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (tourId) => {
        if (!window.confirm('Remove this tour from wishlist?')) {
            return;
        }

        try {
            await wishlistService.removeFromWishlist(user.id, tourId);
            fetchWishlist(); // Refresh list
        } catch (err) {
            alert('Failed to remove from wishlist');
        }
    };

    const handleClearAll = async () => {
        if (wishlist.length === 0) return;

        if (!window.confirm('Clear all items from wishlist?')) {
            return;
        }

        try {
            await wishlistService.clearWishlist(user.id);
            fetchWishlist();
        } catch (err) {
            alert('Failed to clear wishlist');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return <div className="loading-page">Loading your wishlist...</div>;
    }

    return (
        <div className="wishlist-page">
            <div className="wishlist-container">
                <div className="wishlist-header">
                    <div>
                        <h1><FaHeart className="heart-icon" /> My Wishlist</h1>
                        <p>Your favorite tours in one place</p>
                    </div>
                    {wishlist.length > 0 && (
                        <button 
                            className="btn-clear-all"
                            onClick={handleClearAll}
                        >
                            <FaTrash /> Clear All
                        </button>
                    )}
                </div>

                {error && <div className="error-box">{error}</div>}

                {!loading && wishlist.length === 0 && (
                    <div className="empty-wishlist">
                        <FaHeart className="empty-icon" />
                        <h3>Your Wishlist is Empty</h3>
                        <p>Start adding tours you love to your wishlist!</p>
                        <button 
                            onClick={() => navigate('/tours')}
                            className="btn-browse"
                        >
                            Browse Tours
                        </button>
                    </div>
                )}

                {wishlist.length > 0 && (
                    <div className="wishlist-grid">
                        {wishlist.map(item => (
                            <div key={item.id} className="wishlist-card">
                                <div className="wishlist-image">
                                    <img 
                                        src={item.tour.imageUrl || 'https://via.placeholder.com/400x250'} 
                                        alt={item.tour.title}
                                        onClick={() => navigate(`/tours/${item.tour.id}`)}
                                    />
                                    <button 
                                        className="btn-remove"
                                        onClick={() => handleRemove(item.tour.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>

                                <div className="wishlist-content">
                                    <h3 
                                        className="tour-title"
                                        onClick={() => navigate(`/tours/${item.tour.id}`)}
                                    >
                                        {item.tour.title}
                                    </h3>

                                    <div className="tour-meta">
                                        <div className="meta-item">
                                            <FaMapMarkerAlt className="icon" />
                                            <span>{item.tour.destination}</span>
                                        </div>
                                        <div className="meta-item">
                                            <FaClock className="icon" />
                                            <span>{item.tour.duration} Days</span>
                                        </div>
                                    </div>

                                    <p className="tour-description">
                                        {item.tour.description.length > 100 
                                            ? `${item.tour.description.substring(0, 100)}...` 
                                            : item.tour.description}
                                    </p>

                                    <div className="tour-dates">
                                        <small>Starts: {formatDate(item.tour.startDate)}</small>
                                    </div>

                                    <div className="wishlist-footer">
                                        <div className="tour-price">
                                            <FaRupeeSign className="rupee-icon" />
                                            <span>{item.tour.price.toLocaleString('en-IN')}</span>
                                            <small>/person</small>
                                        </div>

                                        <button 
                                            className="btn-book"
                                            onClick={() => navigate(`/tours/${item.tour.id}`)}
                                        >
                                            <FaShoppingCart /> Book Now
                                        </button>
                                    </div>

                                    <div className="added-date">
                                        Added on {formatDate(item.addedAt)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyWishlist;