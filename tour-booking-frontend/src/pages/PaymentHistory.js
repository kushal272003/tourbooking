import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';
import paymentService from '../services/paymentService';
import { 
    FaHistory, 
    FaDownload, 
    FaEye,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaRupeeSign,
    FaFilter,
    FaArrowLeft
} from 'react-icons/fa';
import '../assets/Payment.css';

const PaymentHistory = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, success, failed, created
    const [downloading, setDownloading] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchPaymentHistory();
    }, [isAuthenticated]);

    useEffect(() => {
        applyFilter();
    }, [filter, payments]);

    const fetchPaymentHistory = async () => {
        setLoading(true);
        setError('');

        try {
            // Get user's bookings
            const bookings = await bookingService.getUserBookings(user.id);
            
            // Fetch payment for each booking
            const paymentsPromises = bookings.map(async (booking) => {
                try {
                    const payment = await paymentService.getPaymentByBookingId(booking.id);
                    return { ...payment, booking };
                } catch (err) {
                    // No payment found for this booking
                    return null;
                }
            });

            const paymentsData = await Promise.all(paymentsPromises);
            
            // Filter out null values and sort by date (newest first)
            const validPayments = paymentsData
                .filter(p => p !== null)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setPayments(validPayments);
            setFilteredPayments(validPayments);

            console.log('Payment history loaded:', validPayments.length);

        } catch (err) {
            console.error('Error fetching payment history:', err);
            setError('Failed to load payment history');
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = () => {
        if (filter === 'all') {
            setFilteredPayments(payments);
        } else {
            const filtered = payments.filter(p => 
                p.status.toLowerCase() === filter.toLowerCase()
            );
            setFilteredPayments(filtered);
        }
    };

    const handleDownloadReceipt = (payment) => {
        if (!payment || !payment.booking) {
            alert('Receipt data not available');
            return;
        }

        setDownloading(payment.id);

        try {
            paymentService.downloadReceipt(payment, payment.booking);
            console.log('✅ Receipt downloaded');
        } catch (error) {
            console.error('Error downloading receipt:', error);
            alert('Failed to download receipt');
        } finally {
            setDownloading(null);
        }
    };

    const handleViewBooking = (bookingId) => {
        navigate('/my-bookings');
    };

    const getStatusBadge = (status) => {
        const badges = {
            SUCCESS: { icon: <FaCheckCircle />, class: 'status-success', text: 'Success' },
            FAILED: { icon: <FaTimesCircle />, class: 'status-failed', text: 'Failed' },
            CREATED: { icon: <FaClock />, class: 'status-created', text: 'Pending' }
        };
        
        const badge = badges[status] || badges.CREATED;
        
        return (
            <span className={`payment-status-badge ${badge.class}`}>
                {badge.icon} {badge.text}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateTotalAmount = () => {
        return filteredPayments
            .filter(p => p.status === 'SUCCESS')
            .reduce((sum, p) => sum + p.amount, 0);
    };

    if (loading) {
        return (
            <div className="payment-history-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading payment history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-history-page">
            <div className="history-container">
                {/* Header */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="btn-back"
                >
                    <FaArrowLeft /> Back
                </button>

                <div className="history-header">
                    <div>
                        <h1><FaHistory /> Payment History</h1>
                        <p>View all your past transactions</p>
                    </div>
                    <div className="total-spent">
                        <span>Total Spent</span>
                        <div className="total-amount">
                            <FaRupeeSign />
                            {calculateTotalAmount().toLocaleString('en-IN')}
                        </div>
                    </div>
                </div>

                {error && <div className="error-box">{error}</div>}

                {/* Filter Section */}
                <div className="filter-section">
                    <FaFilter className="filter-icon" />
                    <button 
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        All ({payments.length})
                    </button>
                    <button 
                        className={filter === 'success' ? 'active' : ''}
                        onClick={() => setFilter('success')}
                    >
                        Success ({payments.filter(p => p.status === 'SUCCESS').length})
                    </button>
                    <button 
                        className={filter === 'created' ? 'active' : ''}
                        onClick={() => setFilter('created')}
                    >
                        Pending ({payments.filter(p => p.status === 'CREATED').length})
                    </button>
                    <button 
                        className={filter === 'failed' ? 'active' : ''}
                        onClick={() => setFilter('failed')}
                    >
                        Failed ({payments.filter(p => p.status === 'FAILED').length})
                    </button>
                </div>

                {/* Payments List */}
                {filteredPayments.length === 0 ? (
                    <div className="no-payments">
                        <div className="no-payments-icon">💳</div>
                        <h3>No payment history found</h3>
                        <p>Your payment transactions will appear here</p>
                        <button 
                            className="btn-explore"
                            onClick={() => navigate('/tours')}
                        >
                            Explore Tours
                        </button>
                    </div>
                ) : (
                    <div className="payments-list">
                        {filteredPayments.map((payment) => (
                            <div key={payment.id} className="payment-card">
                                <div className="payment-card-header">
                                    <div className="payment-info">
                                        <h4>{payment.booking.tour.title}</h4>
                                        <p className="payment-id">
                                            Payment ID: {payment.razorpayPaymentId || payment.razorpayOrderId}
                                        </p>
                                    </div>
                                    {getStatusBadge(payment.status)}
                                </div>

                                <div className="payment-card-body">
                                    <div className="payment-detail">
                                        <span className="label">Booking ID:</span>
                                        <span className="value">#{payment.booking.id}</span>
                                    </div>

                                    <div className="payment-detail">
                                        <span className="label">Tour Destination:</span>
                                        <span className="value">{payment.booking.tour.destination}</span>
                                    </div>

                                    <div className="payment-detail">
                                        <span className="label">Seats:</span>
                                        <span className="value">{payment.booking.numberOfSeats}</span>
                                    </div>

                                    <div className="payment-detail">
                                        <span className="label">Payment Date:</span>
                                        <span className="value">{formatDate(payment.createdAt)}</span>
                                    </div>

                                    <div className="payment-detail">
                                        <span className="label">Payment Method:</span>
                                        <span className="value">{payment.currency || 'INR'}</span>
                                    </div>

                                    <div className="payment-divider"></div>

                                    <div className="payment-detail amount">
                                        <span className="label">Amount:</span>
                                        <span className="value">
                                            <FaRupeeSign />
                                            {payment.amount.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>

                                <div className="payment-card-actions">
                                    {payment.status === 'SUCCESS' && (
                                        <button 
                                            className="btn-download-small"
                                            onClick={() => handleDownloadReceipt(payment)}
                                            disabled={downloading === payment.id}
                                        >
                                            <FaDownload /> 
                                            {downloading === payment.id ? 'Downloading...' : 'Receipt'}
                                        </button>
                                    )}

                                    <button 
                                        className="btn-view-small"
                                        onClick={() => handleViewBooking(payment.booking.id)}
                                    >
                                        <FaEye /> View Booking
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHistory;