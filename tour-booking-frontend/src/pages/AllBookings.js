import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';
import { 
    FaArrowLeft,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaFilter,
    FaEye
} from 'react-icons/fa';
import '../assets/AllBookings.css';

const AllBookings = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled, completed

    useEffect(() => {
        if (!isAdmin()) {
            alert('Access Denied! Admin only.');
            navigate('/');
            return;
        }
        fetchAllBookings();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [filter, bookings]);

    const fetchAllBookings = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await bookingService.getAllBookings();
            // Sort by booking date (newest first)
            const sortedData = data.sort((a, b) => 
                new Date(b.bookingDate) - new Date(a.bookingDate)
            );
            setBookings(sortedData);
            setFilteredBookings(sortedData);
        } catch (err) {
            setError('Failed to load bookings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = () => {
        if (filter === 'all') {
            setFilteredBookings(bookings);
        } else {
            const filtered = bookings.filter(b => 
                b.status.toLowerCase() === filter.toLowerCase()
            );
            setFilteredBookings(filtered);
        }
    };

    const handleConfirmBooking = async (bookingId) => {
        if (!window.confirm('Confirm this booking?')) {
            return;
        }

        try {
            await bookingService.confirmBooking(bookingId);
            alert('Booking confirmed successfully!');
            fetchAllBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to confirm booking');
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Cancel this booking?')) {
            return;
        }

        try {
            await bookingService.cancelBooking(bookingId);
            alert('Booking cancelled successfully!');
            fetchAllBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const handleCompleteBooking = async (bookingId) => {
        if (!window.confirm('Mark this booking as completed?')) {
            return;
        }

        try {
            await bookingService.completeBooking(bookingId);
            alert('Booking marked as completed!');
            fetchAllBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to complete booking');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            PENDING: { icon: <FaClock />, class: 'status-pending' },
            CONFIRMED: { icon: <FaCheckCircle />, class: 'status-confirmed' },
            CANCELLED: { icon: <FaTimesCircle />, class: 'status-cancelled' },
            COMPLETED: { icon: <FaCheckCircle />, class: 'status-completed' }
        };
        
        const badge = badges[status] || badges.PENDING;
        
        return (
            <span className={`status-badge ${badge.class}`}>
                {badge.icon} {status}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="loading-page">Loading bookings...</div>;
    }

    return (
        <div className="all-bookings-page">
            <div className="bookings-container">
                <button onClick={() => navigate('/admin/dashboard')} className="btn-back">
                    <FaArrowLeft /> Back to Dashboard
                </button>

                <div className="bookings-header">
                    <div>
                        <h1>All Bookings</h1>
                        <p>Manage and monitor all customer bookings</p>
                    </div>
                    <div className="bookings-count">
                        Total: <strong>{filteredBookings.length}</strong> bookings
                    </div>
                </div>

                {error && <div className="error-box">{error}</div>}

                {/* Filter Buttons */}
                <div className="filter-section">
                    <FaFilter className="filter-icon" />
                    <button 
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        All ({bookings.length})
                    </button>
                    <button 
                        className={filter === 'pending' ? 'active' : ''}
                        onClick={() => setFilter('pending')}
                    >
                        Pending ({bookings.filter(b => b.status === 'PENDING').length})
                    </button>
                    <button 
                        className={filter === 'confirmed' ? 'active' : ''}
                        onClick={() => setFilter('confirmed')}
                    >
                        Confirmed ({bookings.filter(b => b.status === 'CONFIRMED').length})
                    </button>
                    <button 
                        className={filter === 'completed' ? 'active' : ''}
                        onClick={() => setFilter('completed')}
                    >
                        Completed ({bookings.filter(b => b.status === 'COMPLETED').length})
                    </button>
                    <button 
                        className={filter === 'cancelled' ? 'active' : ''}
                        onClick={() => setFilter('cancelled')}
                    >
                        Cancelled ({bookings.filter(b => b.status === 'CANCELLED').length})
                    </button>
                </div>

                {/* Bookings Table */}
                <div className="bookings-table-wrapper">
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Customer</th>
                                <th>Tour</th>
                                <th>Tour Date</th>
                                <th>Seats</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Booked On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map(booking => (
                                <tr key={booking.id}>
                                    <td>#{booking.id}</td>
                                    <td>
                                        <div className="customer-cell">
                                            <strong>{booking.user.name}</strong>
                                            <small>{booking.user.email}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="tour-cell">
                                            <strong>{booking.tour.title}</strong>
                                            <small>{booking.tour.destination}</small>
                                        </div>
                                    </td>
                                    <td>{formatDate(booking.tour.startDate)}</td>
                                    <td className="seats-cell">{booking.numberOfSeats}</td>
                                    <td className="amount-cell">
                                        ₹{booking.totalPrice.toLocaleString('en-IN')}
                                    </td>
                                    <td>
                                        <span className={`payment-badge ${booking.paymentStatus.toLowerCase()}`}>
                                            {booking.paymentStatus}
                                        </span>
                                    </td>
                                    <td>{getStatusBadge(booking.status)}</td>
                                    <td className="date-cell">
                                        {formatDateTime(booking.bookingDate)}
                                    </td>
                                    <td className="action-buttons">
                                        <button 
                                            className="btn-icon btn-view"
                                            onClick={() => navigate(`/tours/${booking.tour.id}`)}
                                            title="View Tour"
                                        >
                                            <FaEye />
                                        </button>

                                        {booking.status === 'PENDING' && (
                                            <>
                                                <button 
                                                    className="btn-icon btn-confirm"
                                                    onClick={() => handleConfirmBooking(booking.id)}
                                                    title="Confirm"
                                                >
                                                    <FaCheckCircle />
                                                </button>
                                                <button 
                                                    className="btn-icon btn-cancel"
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                    title="Cancel"
                                                >
                                                    <FaTimesCircle />
                                                </button>
                                            </>
                                        )}

                                        {booking.status === 'CONFIRMED' && (
                                            <button 
                                                className="btn-icon btn-complete"
                                                onClick={() => handleCompleteBooking(booking.id)}
                                                title="Complete"
                                            >
                                                <FaCheckCircle />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredBookings.length === 0 && (
                        <div className="no-data">
                            <p>No bookings found for selected filter</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllBookings;