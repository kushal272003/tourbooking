import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import { 
    FaMapMarkerAlt, 
    FaCalendar, 
    FaUsers, 
    FaRupeeSign,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaEye,
    FaEnvelope,
    FaPhone
} from 'react-icons/fa';
import '../assets/MyBookings.css';

const MyBookings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await bookingService.getUserBookings(user.id);
            console.log("📦 Bookings data:", data);  // ✅ Debug log
            console.log("📦 First booking:", data[0]);  // ✅ Debug log
            
            // Sort by booking date (newest first)
            const sortedData = data.sort((a, b) => 
                new Date(b.bookingDate) - new Date(a.bookingDate)
            );
            setBookings(sortedData);
        } catch (err) {
            setError('Failed to load bookings');
            console.error("❌ Error fetching bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        setCancellingId(bookingId);

        try {
            await bookingService.cancelBooking(bookingId);
            alert('Booking cancelled successfully!');
            fetchBookings(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || 'Failed to cancel booking');
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            PENDING: { icon: <FaClock />, class: 'status-pending', text: 'Pending' },
            CONFIRMED: { icon: <FaCheckCircle />, class: 'status-confirmed', text: 'Confirmed' },
            CANCELLED: { icon: <FaTimesCircle />, class: 'status-cancelled', text: 'Cancelled' },
            COMPLETED: { icon: <FaCheckCircle />, class: 'status-completed', text: 'Completed' }
        };
        
        const badge = badges[status] || badges.PENDING;
        
        return (
            <span className={`status-badge ${badge.class}`}>
                {badge.icon} {badge.text}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="loading-page">Loading your bookings...</div>;
    }

    return (
        <div className="my-bookings-page">
            <div className="bookings-container">
                <div className="bookings-header">
                    <h1>My Bookings</h1>
                    <p>Manage all your tour bookings in one place</p>
                </div>

                {error && <div className="error-box">{error}</div>}

                {!loading && bookings.length === 0 && (
                    <div className="no-bookings">
                        <div className="no-bookings-icon">📅</div>
                        <h3>No Bookings Yet</h3>
                        <p>You haven't made any bookings. Explore our amazing tours!</p>
                        <button 
                            onClick={() => navigate('/tours')} 
                            className="btn-explore"
                        >
                            Explore Tours
                        </button>
                    </div>
                )}

                {bookings.length > 0 && (
                    <div className="bookings-grid">
                        {bookings.map(booking => (
                            <div key={booking.bookingId || booking.id} className="booking-card">
                                <div className="booking-header">
                                    <div className="booking-id">
                                        Booking #{booking.bookingId || booking.id}
                                    </div>
                                    {getStatusBadge(booking.status)}
                                </div>

                                <div className="booking-tour-info">
                                    <div className="tour-image-small">
                                        {/* ✅ FIXED: Use tourImageUrl instead of tour.imageUrl */}
                                        <img 
                                            src={booking.tourImageUrl || booking.tour?.imageUrl || 'https://via.placeholder.com/300x200?text=Tour+Image'} 
                                            alt={booking.tourTitle || booking.tour?.title || 'Tour'} 
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                            }}
                                        />
                                    </div>

                                    <div className="tour-details-small">
                                        {/* ✅ FIXED: Use tourTitle instead of tour.title */}
                                        <h3>{booking.tourTitle || booking.tour?.title || 'Untitled Tour'}</h3>
                                        
                                        <div className="tour-meta-small">
                                            <div className="meta-item-small">
                                                <FaMapMarkerAlt className="icon" />
                                                {/* ✅ FIXED: Use tourDestination */}
                                                <span>{booking.tourDestination || booking.tour?.destination || 'N/A'}</span>
                                            </div>

                                            {/* ✅ UPDATED: tourStartDate might not be in response */}
                                            {booking.tourStartDate && (
                                                <div className="meta-item-small">
                                                    <FaCalendar className="icon" />
                                                    <span>{formatDate(booking.tourStartDate)}</span>
                                                </div>
                                            )}

                                            <div className="meta-item-small">
                                                <FaUsers className="icon" />
                                                <span>{booking.numberOfSeats} Seat{booking.numberOfSeats > 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ✅ NEW: Show Contact Details */}
                                <div className="booking-contact-info">
                                    <div className="contact-item">
                                        <FaEnvelope className="icon" />
                                        <span>{booking.contactEmail}</span>
                                    </div>
                                    <div className="contact-item">
                                        <FaPhone className="icon" />
                                        <span>{booking.contactPhone}</span>
                                    </div>
                                </div>

                                {/* ✅ NEW: Show Passenger Summary */}
                                {booking.passengers && booking.passengers.length > 0 && (
                                    <div className="passengers-summary-small">
                                        <h4>Passengers ({booking.passengers.length})</h4>
                                        <div className="passengers-list-small">
                                            {booking.passengers.map((passenger, index) => (
                                                <div key={index} className="passenger-item-small">
                                                    {passenger.isPrimary && <span className="primary-badge">⭐</span>}
                                                    <span className="passenger-name">{passenger.name}</span>
                                                    <span className="passenger-age">({passenger.age} yrs)</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="booking-details">
                                    <div className="detail-row">
                                        <span className="label">Booking Date:</span>
                                        <span className="value">{formatDateTime(booking.bookingDate)}</span>
                                    </div>

                                    <div className="detail-row">
                                        <span className="label">Payment Status:</span>
                                        <span className={`payment-status ${booking.paymentStatus?.toLowerCase() || 'pending'}`}>
                                            {booking.paymentStatus || 'PENDING'}
                                        </span>
                                    </div>

                                    <div className="detail-row total-price-row">
                                        <span className="label">Total Amount:</span>
                                        <span className="total-price">
                                            <FaRupeeSign /> {booking.totalPrice?.toLocaleString('en-IN') || '0'}
                                        </span>
                                    </div>
                                </div>

                                <div className="booking-actions">
                                    {/* ✅ FIXED: Use tourId instead of tour.id */}
                                    <button 
                                        onClick={() => navigate(`/tours/${booking.tourId || booking.tour?.id}`)}
                                        className="btn-view"
                                    >
                                        <FaEye /> View Tour
                                    </button>

                                    {booking.status === 'PENDING' && (
                                        <button 
                                            onClick={() => handleCancelBooking(booking.bookingId || booking.id)}
                                            className="btn-cancel"
                                            disabled={cancellingId === (booking.bookingId || booking.id)}
                                        >
                                            {cancellingId === (booking.bookingId || booking.id) ? 'Cancelling...' : 'Cancel Booking'}
                                        </button>
                                    )}

                                    {booking.status === 'CONFIRMED' && booking.paymentStatus === 'PENDING' && (
                                        <button className="btn-pay">
                                            Pay Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;