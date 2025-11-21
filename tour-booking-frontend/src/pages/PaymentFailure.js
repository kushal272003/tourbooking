// src/pages/PaymentFailure.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import { 
    FaTimesCircle, 
    FaHome, 
    FaRedo,
    FaTicketAlt,
    FaExclamationTriangle
} from 'react-icons/fa';
import '../assets/Payment.css';

const PaymentFailure = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);

    console.log("❌ ========== PAYMENT FAILURE PAGE ==========");
    console.log("📍 Location State:", location.state);

    const stateData = location.state || {};
    const { error, bookingId } = stateData;

    useEffect(() => {
        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId]);

    const fetchBookingDetails = async () => {
        console.log("📤 Fetching booking details for failed payment...");
        setLoading(true);
        
        try {
            const bookingData = await bookingService.getBookingById(bookingId);
            console.log("✅ Booking data loaded:", bookingData);
            setBooking(bookingData);
        } catch (err) {
            console.error("❌ Error fetching booking:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRetryPayment = () => {
        // Simply redirect to my bookings where user can see pending booking
        navigate('/my-bookings');
    };

    const handleGoToBookings = () => {
        navigate('/my-bookings');
    };

    const handleGoToHome = () => {
        navigate('/');
    };

    const handleGoToTours = () => {
        navigate('/tours');
    };

    return (
        <div className="payment-result-page">
            <div className="payment-result-container failure">
                {/* Failure Icon */}
                <div className="failure-icon">
                    <FaTimesCircle />
                </div>

                {/* Failure Message */}
                <h1 className="failure-title">Payment Failed</h1>
                <p className="failure-subtitle">
                    {error || "We couldn't process your payment. Please try again."}
                </p>

                {/* Warning Message */}
                <div className="warning-box">
                    <FaExclamationTriangle />
                    <p>Your booking is still in PENDING status. You can retry the payment from My Bookings page.</p>
                </div>

                {/* Error Details */}
                {bookingId && (
                    <div className="error-details-card">
                        <h3>Booking Information</h3>
                        
                        {loading ? (
                            <div className="loading-small">
                                <div className="spinner-small"></div>
                                <p>Loading booking details...</p>
                            </div>
                        ) : booking ? (
                            <>
                                <div className="detail-row">
                                    <span className="label">Booking ID:</span>
                                    <span className="value">#{bookingId}</span>
                                </div>
                                
                                {/* ✅ FIXED: Safe access with multiple fallbacks */}
                                {(booking.tourTitle || booking.tour?.title) && (
                                    <div className="detail-row">
                                        <span className="label">Tour:</span>
                                        <span className="value">
                                            {booking.tourTitle || booking.tour?.title}
                                        </span>
                                    </div>
                                )}

                                {(booking.tourDestination || booking.tour?.destination) && (
                                    <div className="detail-row">
                                        <span className="label">Destination:</span>
                                        <span className="value">
                                            {booking.tourDestination || booking.tour?.destination}
                                        </span>
                                    </div>
                                )}
                                
                                <div className="detail-row">
                                    <span className="label">Number of Seats:</span>
                                    <span className="value">{booking.numberOfSeats || 0}</span>
                                </div>

                                <div className="detail-row">
                                    <span className="label">Amount:</span>
                                    <span className="value">
                                        ₹{booking.totalPrice?.toLocaleString('en-IN') || '0'}
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span className="label">Status:</span>
                                    <span className="value status-pending">{booking.status || 'PENDING'}</span>
                                </div>

                                {(booking.contactEmail || booking.user?.email) && (
                                    <div className="detail-row">
                                        <span className="label">Contact Email:</span>
                                        <span className="value">
                                            {booking.contactEmail || booking.user?.email}
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="no-booking-data">
                                <p>Booking ID: #{bookingId}</p>
                                <p className="note">Could not load complete booking details</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button 
                        className="btn-retry"
                        onClick={handleRetryPayment}
                    >
                        <FaRedo /> Go to My Bookings
                    </button>

                    <button 
                        className="btn-tours"
                        onClick={handleGoToTours}
                    >
                        Browse Tours
                    </button>

                    <button 
                        className="btn-home"
                        onClick={handleGoToHome}
                    >
                        <FaHome /> Back to Home
                    </button>
                </div>

                {/* Help Section */}
                <div className="help-section">
                    <h3>Need Help?</h3>
                    <p>If you continue to face issues, please contact our support team.</p>
                    <p>📧 support@tourbooking.com | 📞 1800-XXX-XXXX</p>
                </div>

                {/* Common Reasons */}
                <div className="common-reasons">
                    <h3>Common Reasons for Payment Failure:</h3>
                    <ul>
                        <li>❌ Insufficient balance in account</li>
                        <li>❌ Incorrect card details</li>
                        <li>❌ Network connectivity issues</li>
                        <li>❌ Payment gateway timeout</li>
                        <li>❌ Bank authorization declined</li>
                        <li>❌ Card limit exceeded</li>
                    </ul>
                </div>

                {/* Next Steps */}
                <div className="next-steps-box">
                    <h3>What to do next?</h3>
                    <ol>
                        <li>Check your payment method and try again</li>
                        <li>Go to "My Bookings" to retry payment for pending booking</li>
                        <li>Contact your bank if the issue persists</li>
                        <li>Contact our support team for assistance</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;