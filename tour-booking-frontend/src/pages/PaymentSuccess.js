import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import paymentService from '../services/paymentService';
import bookingService from '../services/bookingService';
import { 
    FaCheckCircle, 
    FaDownload, 
    FaHome, 
    FaTicketAlt,
    FaRupeeSign,
    FaCalendar,
    FaMapMarkerAlt
} from 'react-icons/fa';
import '../assets/Payment.css';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [payment, setPayment] = useState(null);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    // Get data from navigation state
    const { paymentId, orderId, bookingId, amount } = location.state || {};

    useEffect(() => {
        // If no state data, redirect to home
        if (!bookingId) {
            navigate('/');
            return;
        }

        fetchPaymentAndBookingDetails();
    }, [bookingId]);

    const fetchPaymentAndBookingDetails = async () => {
        setLoading(true);
        try {
            // Fetch booking details
            const bookingData = await bookingService.getBookingById(bookingId);
            setBooking(bookingData);

            // Fetch payment details
            const paymentData = await paymentService.getPaymentByBookingId(bookingId);
            setPayment(paymentData);

            console.log('✅ Payment and booking details loaded');
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReceipt = () => {
        if (!payment || !booking) {
            alert('Receipt data not available');
            return;
        }

        setDownloading(true);
        
        try {
            paymentService.downloadReceipt(payment, booking);
            console.log('✅ Receipt downloaded');
        } catch (error) {
            console.error('Error downloading receipt:', error);
            alert('Failed to download receipt');
        } finally {
            setDownloading(false);
        }
    };

    const handleGoToBookings = () => {
        navigate('/my-bookings');
    };

    const handleGoToHome = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="payment-result-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading payment details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-result-page">
            <div className="payment-result-container success">
                {/* Success Animation */}
                <div className="success-animation">
                    <div className="success-checkmark">
                        <FaCheckCircle />
                    </div>
                    <div className="success-confetti">
                        <div className="confetti"></div>
                        <div className="confetti"></div>
                        <div className="confetti"></div>
                        <div className="confetti"></div>
                        <div className="confetti"></div>
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="success-title">Payment Successful! 🎉</h1>
                <p className="success-subtitle">
                    Your booking has been confirmed. We've sent you a confirmation email.
                </p>

                {/* Payment Details Card */}
                <div className="payment-details-card">
                    <h3>Payment Details</h3>
                    
                    <div className="detail-row">
                        <span className="label">Payment ID:</span>
                        <span className="value">{paymentId || payment?.razorpayPaymentId}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Order ID:</span>
                        <span className="value">{orderId || payment?.razorpayOrderId}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Booking ID:</span>
                        <span className="value">#{bookingId}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Payment Date:</span>
                        <span className="value">
                            {payment ? new Date(payment.createdAt).toLocaleString('en-IN') : 'Just now'}
                        </span>
                    </div>

                    <div className="detail-divider"></div>

                    <div className="detail-row total">
                        <span className="label">Amount Paid:</span>
                        <span className="value amount">
                            <FaRupeeSign />
                            {(amount || payment?.amount || 0).toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>

                {/* Booking Details Card */}
                {booking && (
                    <div className="booking-details-card">
                        <h3>Booking Details</h3>

                        <div className="tour-info-large">
                            {booking.tour.imageUrl && (
                                <div className="tour-image">
                                    <img 
                                        src={booking.tour.imageUrl} 
                                        alt={booking.tour.title}
                                    />
                                </div>
                            )}

                            <div className="tour-details">
                                <h4>{booking.tour.title}</h4>
                                
                                <div className="tour-meta">
                                    <span>
                                        <FaMapMarkerAlt /> {booking.tour.destination}
                                    </span>
                                    <span>
                                        <FaCalendar /> {new Date(booking.tour.startDate).toLocaleDateString('en-IN')}
                                    </span>
                                    <span>
                                        <FaTicketAlt /> {booking.numberOfSeats} {booking.numberOfSeats === 1 ? 'Seat' : 'Seats'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button 
                        className="btn-download"
                        onClick={handleDownloadReceipt}
                        disabled={downloading || !payment || !booking}
                    >
                        <FaDownload /> 
                        {downloading ? 'Downloading...' : 'Download Receipt'}
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

                {/* Next Steps */}
                <div className="next-steps">
                    <h3>What's Next?</h3>
                    <ul>
                        <li>✅ Check your email for booking confirmation</li>
                        <li>✅ Download and save your receipt</li>
                        <li>✅ You'll receive tour details 24 hours before departure</li>
                        <li>✅ Contact us if you have any questions</li>
                    </ul>
                </div>

                {/* Thank You Message */}
                <div className="thank-you-message">
                    <p>Thank you for choosing Tour Booking Service!</p>
                    <p>We hope you have an amazing experience! 🌟</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;