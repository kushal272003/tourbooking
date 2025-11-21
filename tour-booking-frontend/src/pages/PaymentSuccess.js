// src/pages/PaymentSuccess.jsx
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
    const [error, setError] = useState(null);

    console.log("🎉 ========== PAYMENT SUCCESS PAGE LOADED ==========");
    console.log("📍 Location State:", location.state);

    // Get data from navigation state
    const stateData = location.state || {};
    const { paymentId, orderId, bookingId, amount, tourTitle, tourImage } = stateData;

    console.log("📦 Extracted Data:");
    console.log("  - Payment ID:", paymentId);
    console.log("  - Order ID:", orderId);
    console.log("  - Booking ID:", bookingId);
    console.log("  - Amount:", amount);

    useEffect(() => {
        console.log("🔄 useEffect triggered");
        
        if (!bookingId) {
            console.error("❌ No booking ID found in state!");
            console.log("🔄 Redirecting to home...");
            alert("No booking information found. Redirecting to home.");
            navigate('/');
            return;
        }

        fetchPaymentAndBookingDetails();
    }, [bookingId]);

    const fetchPaymentAndBookingDetails = async () => {
        console.log("📤 Fetching payment and booking details...");
        setLoading(true);
        setError(null);

        try {
            console.log("📤 Step 1: Fetching booking details for ID:", bookingId);
            
            const bookingData = await bookingService.getBookingById(bookingId);
            console.log("✅ Booking Data:", bookingData);
            setBooking(bookingData);

            console.log("📤 Step 2: Fetching payment details for booking ID:", bookingId);
            
            try {
                const paymentData = await paymentService.getPaymentByBookingId(bookingId);
                console.log("✅ Payment Data:", paymentData);
                setPayment(paymentData);
            } catch (paymentErr) {
                console.warn("⚠️ Could not fetch payment details:", paymentErr);
            }

            console.log("✅ All details loaded successfully");
        } catch (error) {
            console.error("❌ Error fetching details:", error);
            setError("Could not load complete booking details");
        } finally {
            setLoading(false);
        }
    };

    // ✅ UPDATED: Simple receipt download
    const handleDownloadReceipt = () => {
        console.log("📥 Starting receipt download...");
        console.log("Available data - Payment:", payment, "Booking:", booking);
        
        setDownloading(true);
        
        try {
            // Create receipt content with available data
            const receiptContent = `
╔════════════════════════════════════════════════╗
║         TOUR BOOKING - PAYMENT RECEIPT         ║
╔════════════════════════════════════════════════╗

PAYMENT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Payment ID      : ${paymentId || payment?.razorpayPaymentId || 'N/A'}
Order ID        : ${orderId || payment?.razorpayOrderId || 'N/A'}
Booking ID      : #${bookingId}
Amount Paid     : ₹${(amount || payment?.amount || 0).toLocaleString('en-IN')}
Payment Date    : ${payment ? new Date(payment.createdAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}
Status          : SUCCESS ✓

BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tour            : ${tourTitle || booking?.tourTitle || booking?.tour?.title || 'N/A'}
Destination     : ${booking?.tourDestination || booking?.tour?.destination || 'N/A'}
Number of Seats : ${booking?.numberOfSeats || 'N/A'}
Total Price     : ₹${booking?.totalPrice?.toLocaleString('en-IN') || (amount || 0).toLocaleString('en-IN')}

CONTACT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email           : ${booking?.contactEmail || booking?.user?.email || user?.email || 'N/A'}
Phone           : ${booking?.contactPhone || booking?.user?.phone || user?.phone || 'N/A'}

${booking?.passengers ? `PASSENGER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${booking.passengers.map((p, i) => 
  `${i + 1}. ${p.name} (${p.age} years)${p.isPrimary ? ' ⭐ Primary' : ''}`
).join('\n')}
` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Thank you for booking with us!

For any queries, contact:
📧 support@tourbooking.com
📞 1800-XXX-XXXX

Generated on: ${new Date().toLocaleString('en-IN')}
╚════════════════════════════════════════════════╝
            `;

            // Create and download file
            const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `receipt-booking-${bookingId}-${Date.now()}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            console.log('✅ Receipt downloaded successfully');
            alert('Receipt downloaded successfully!');

        } catch (error) {
            console.error('❌ Error downloading receipt:', error);
            alert('Failed to download receipt. Please take a screenshot of this page.');
        } finally {
            setDownloading(false);
        }
    };

    const handleGoToBookings = () => {
        console.log("🔄 Navigating to My Bookings");
        navigate('/my-bookings');
    };

    const handleGoToHome = () => {
        console.log("🔄 Navigating to Home");
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

                {error && (
                    <div className="warning-message">
                        ⚠️ {error}
                    </div>
                )}

                {/* Payment Details Card */}
                <div className="payment-details-card">
                    <h3>Payment Details</h3>
                    
                    <div className="detail-row">
                        <span className="label">Payment ID:</span>
                        <span className="value">{paymentId || payment?.razorpayPaymentId || 'N/A'}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Order ID:</span>
                        <span className="value">{orderId || payment?.razorpayOrderId || 'N/A'}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Booking ID:</span>
                        <span className="value">#{bookingId}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Payment Date:</span>
                        <span className="value">
                            {payment ? new Date(payment.createdAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}
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
                {(booking || tourTitle) && (
                    <div className="booking-details-card">
                        <h3>Booking Details</h3>

                        <div className="tour-info-large">
                            {(tourImage || booking?.tourImageUrl || booking?.tour?.imageUrl) && (
                                <div className="tour-image">
                                    <img 
                                        src={tourImage || booking?.tourImageUrl || booking?.tour?.imageUrl} 
                                        alt={tourTitle || booking?.tourTitle || booking?.tour?.title || 'Tour'}
                                    />
                                </div>
                            )}

                            <div className="tour-details">
                                <h4>{tourTitle || booking?.tourTitle || booking?.tour?.title || 'Your Tour'}</h4>
                                
                                {booking && (
                                    <div className="tour-meta">
                                        <span>
                                            <FaMapMarkerAlt /> {booking.tourDestination || booking.tour?.destination || 'N/A'}
                                        </span>
                                        {(booking.tourStartDate || booking.tour?.startDate) && (
                                            <span>
                                                <FaCalendar /> {new Date(booking.tourStartDate || booking.tour.startDate).toLocaleDateString('en-IN')}
                                            </span>
                                        )}
                                        <span>
                                            <FaTicketAlt /> {booking.numberOfSeats} {booking.numberOfSeats === 1 ? 'Seat' : 'Seats'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button 
                        className="btn-download"
                        onClick={handleDownloadReceipt}
                        disabled={downloading}
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