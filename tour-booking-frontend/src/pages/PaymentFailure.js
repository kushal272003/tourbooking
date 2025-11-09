import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';
import { 
    FaTimesCircle, 
    FaRedo, 
    FaHome, 
    FaTicketAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaExclamationTriangle
} from 'react-icons/fa';
import '../assets/Payment.css';

const PaymentFailure = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get data from navigation state
    const { error, bookingId, orderId } = location.state || {};

    useEffect(() => {
        // If no state data, redirect to home
        if (!bookingId) {
            navigate('/');
            return;
        }

        fetchBookingDetails();
    }, [bookingId]);

    const fetchBookingDetails = async () => {
        setLoading(true);
        try {
            const bookingData = await bookingService.getBookingById(bookingId);
            setBooking(bookingData);
            console.log('Booking details loaded for failed payment');
        } catch (err) {
            console.error('Error fetching booking details:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRetryPayment = () => {
        if (booking) {
            // Navigate back to booking page for retry
            navigate(`/tours/${booking.tour.id}`, {
                state: { retryBookingId: bookingId }
            });
        }
    };

    const handleGoToBookings = () => {
        navigate('/my-bookings');
    };

    const handleGoToHome = () => {
        navigate('/');
    };

    const handleContactSupport = () => {
        // You can add email/phone contact logic here
        window.location.href = 'mailto:support@tourbooking.com?subject=Payment Failed - Booking #' + bookingId;
    };

    // Common reasons for payment failure
    const commonReasons = [
        'Insufficient funds in your account',
        'Incorrect card details or CVV',
        'Card expired or blocked',
        'Bank declined the transaction',
        'Network connectivity issues',
        'Payment timeout',
        'OTP verification failed'
    ];

    if (loading) {
        return (
            <div className="payment-result-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-result-page">
            <div className="payment-result-container failure">
                {/* Failure Animation */}
                <div className="failure-animation">
                    <div className="failure-icon">
                        <FaTimesCircle />
                    </div>
                    <div className="failure-pulse"></div>
                </div>

                {/* Failure Message */}
                <h1 className="failure-title">Payment Failed</h1>
                <p className="failure-subtitle">
                    We couldn't process your payment. Don't worry, no money was deducted.
                </p>

                {/* Error Details Card */}
                <div className="error-details-card">
                    <div className="error-header">
                        <FaExclamationTriangle className="warning-icon" />
                        <h3>What happened?</h3>
                    </div>
                    
                    <div className="error-message">
                        {error || 'Payment processing failed. Please try again.'}
                    </div>

                    {orderId && (
                        <div className="error-info">
                            <span className="label">Order ID:</span>
                            <span className="value">{orderId}</span>
                        </div>
                    )}

                    {bookingId && (
                        <div className="error-info">
                            <span className="label">Booking ID:</span>
                            <span className="value">#{bookingId}</span>
                        </div>
                    )}
                </div>

                {/* Booking Details (if available) */}
                {booking && (
                    <div className="booking-details-card">
                        <h3>Booking Details (Pending Payment)</h3>

                        <div className="tour-info-small">
                            <div className="tour-text">
                                <h4>{booking.tour.title}</h4>
                                <p>📍 {booking.tour.destination}</p>
                                <p>🎫 {booking.numberOfSeats} {booking.numberOfSeats === 1 ? 'Seat' : 'Seats'}</p>
                                <p className="amount-pending">
                                    Amount: ₹{booking.totalPrice.toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Common Reasons */}
                <div className="common-reasons-card">
                    <h3>Common Reasons for Payment Failure</h3>
                    <ul className="reasons-list">
                        {commonReasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                        ))}
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button 
                        className="btn-retry"
                        onClick={handleRetryPayment}
                        disabled={!booking}
                    >
                        <FaRedo /> Retry Payment
                    </button>

                    <button 
                        className="btn-view-bookings"
                        onClick={handleGoToBookings}
                    >
                        <FaTicketAlt /> View My Bookings
                    </button>

                    <button 
                        className="btn-home"
                        onClick={handleGoToHome}
                    >
                        <FaHome /> Back to Home
                    </button>
                </div>

                {/* Contact Support */}
                <div className="support-section">
                    <h3>Need Help?</h3>
                    <p>If you continue to face issues, please contact our support team.</p>
                    
                    <div className="support-options">
                        <button 
                            className="support-btn"
                            onClick={handleContactSupport}
                        >
                            <FaEnvelope /> Email Support
                        </button>
                        
                        <a 
                            href="tel:+911234567890" 
                            className="support-btn"
                        >
                            <FaPhoneAlt /> Call Support
                        </a>
                    </div>
                </div>

                {/* Reassurance Message */}
                <div className="reassurance-message">
                    <p>
                        <strong>Don't worry!</strong> Your booking is still reserved for the next 30 minutes. 
                        You can retry the payment anytime.
                    </p>
                </div>

                {/* Tips Card */}
                <div className="tips-card">
                    <h3>💡 Tips for Successful Payment</h3>
                    <ul>
                        <li>Ensure sufficient balance in your account</li>
                        <li>Check your card expiry date</li>
                        <li>Verify you're entering correct card details</li>
                        <li>Try using a different payment method</li>
                        <li>Check your internet connection</li>
                        <li>Disable VPN if using one</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;