import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import bookingService from '../services/bookingService';
import wishlistService from '../services/wishlistService';
import reviewService from '../services/reviewService';
import { 
    FaUser, 
    FaEnvelope, 
    FaPhone, 
    FaEdit, 
    FaLock,
    FaTicketAlt,
    FaHeart,
    FaStar,
    FaSignOutAlt,
    FaCalendar
} from 'react-icons/fa';
import '../assets/UserProfile.css';

const UserProfile = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const [editMode, setEditMode] = useState(false);
    const [changePasswordMode, setChangePasswordMode] = useState(false);
    
    const [profileData, setProfileData] = useState({
        name: '',
        phone: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [stats, setStats] = useState({
        totalBookings: 0,
        wishlistCount: 0,
        reviewsCount: 0
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setProfileData({
            name: user.name,
            phone: user.phone || ''
        });

        fetchUserStats();
    }, [isAuthenticated, user]);

    const fetchUserStats = async () => {
        try {
            const bookings = await bookingService.getUserBookings(user.id);
            const wishlistCount = await wishlistService.getWishlistCount(user.id);
            const reviews = await reviewService.getUserReviews(user.id);

            setStats({
                totalBookings: bookings.length,
                wishlistCount: wishlistCount,
                reviewsCount: reviews.length
            });
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await authService.updateProfile(user.id, profileData);
            setSuccess('Profile updated successfully!');
            setEditMode(false);
            
            // Update context
            window.location.reload(); // Refresh to update navbar
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate
        if (passwordData.newPassword.length < 6) {
            setError('New password must be at least 6 characters long');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await authService.changePassword(
                user.id,
                passwordData.currentPassword,
                passwordData.newPassword
            );
            setSuccess('Password changed successfully! Please login again.');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setChangePasswordMode(false);
            
            // Logout after 2 seconds
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h1>{user.name}</h1>
                        <p className="user-role">{user.role}</p>
                        <p className="member-since">
                            <FaCalendar /> Member since {formatDate(user.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card" onClick={() => navigate('/my-bookings')}>
                        <FaTicketAlt className="stat-icon bookings" />
                        <div>
                            <h3>{stats.totalBookings}</h3>
                            <p>Total Bookings</p>
                        </div>
                    </div>

                    <div className="stat-card" onClick={() => navigate('/my-wishlist')}>
                        <FaHeart className="stat-icon wishlist" />
                        <div>
                            <h3>{stats.wishlistCount}</h3>
                            <p>Wishlist Items</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <FaStar className="stat-icon reviews" />
                        <div>
                            <h3>{stats.reviewsCount}</h3>
                            <p>Reviews Written</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                {/* Profile Details Section */}
                <div className="profile-section">
                    <div className="section-header">
                        <h2>Profile Details</h2>
                        {!editMode && (
                            <button 
                                className="btn-edit"
                                onClick={() => setEditMode(true)}
                            >
                                <FaEdit /> Edit Profile
                            </button>
                        )}
                    </div>

                    {!editMode ? (
                        <div className="profile-details">
                            <div className="detail-item">
                                <FaUser className="icon" />
                                <div>
                                    <label>Full Name</label>
                                    <p>{user.name}</p>
                                </div>
                            </div>

                            <div className="detail-item">
                                <FaEnvelope className="icon" />
                                <div>
                                    <label>Email</label>
                                    <p>{user.email}</p>
                                </div>
                            </div>

                            <div className="detail-item">
                                <FaPhone className="icon" />
                                <div>
                                    <label>Phone</label>
                                    <p>{user.phone || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleProfileUpdate} className="edit-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                />
                                <small>Email cannot be changed</small>
                            </div>

                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                    pattern="[0-9]{10}"
                                    placeholder="10-digit phone number"
                                />
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn-cancel"
                                    onClick={() => {
                                        setEditMode(false);
                                        setProfileData({ name: user.name, phone: user.phone || '' });
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-save"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Change Password Section */}
                <div className="profile-section">
                    <div className="section-header">
                        <h2>Security</h2>
                        {!changePasswordMode && (
                            <button 
                                className="btn-edit"
                                onClick={() => setChangePasswordMode(true)}
                            >
                                <FaLock /> Change Password
                            </button>
                        )}
                    </div>

                    {changePasswordMode && (
                        <form onSubmit={handlePasswordChange} className="edit-form">
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                    required
                                    minLength="6"
                                />
                                <small>Minimum 6 characters</small>
                            </div>

                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn-cancel"
                                    onClick={() => {
                                        setChangePasswordMode(false);
                                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-save"
                                    disabled={loading}
                                >
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>

                           
 
                        </form>
                    )}
                </div>
                <div className="profile-section logout-section">
  <h2>Account</h2>
  <button onClick={() => { logout(); navigate('/login'); }} className="btn-logout">
    <FaSignOutAlt /> Logout
  </button>
</div>
            </div>
        </div>
    );
};

export default UserProfile;