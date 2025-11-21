import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paymentService from '../services/paymentService';
import bookingService from '../services/bookingService';
import { FaRupeeSign, FaCreditCard, FaLock } from 'react-icons/fa';
import '../assets/Payment.css';

/**
 * PaymentCheckout Component
 * Handles Razorpay payment flow
 * 
 * @param {Object} props
 * @param {Object} props.booking - Booking object
 * @param {Function} props.onSuccess - Success callback
 * @param {Function} props.onFailure - Failure callback
 * @param {Function} props.onCancel - Cancel callback
 */
const PaymentCheckout = ({ booking, onSuccess, onFailure, onCancel }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /**
     * Initiate payment process
     */
    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            // Step 1: Create payment order from backend
            console.log('📝 Creating payment order for booking:', booking.id);
            const orderData = await paymentService.createPaymentOrder(booking.id);
            
            console.log('✅ Order created:', orderData);

            // Step 2: Configure Razorpay options
            const razorpayOptions = {
                key: orderData.key, // Razorpay Key ID from backend
                amount: orderData.amount, // Amount in paise
                currency: orderData.currency,
                name: 'Tour Booking Service',
                description: `Payment for ${booking.tour.title}`,
                image: '/logo192.png', // Optional: Add your logo
                order_id: orderData.orderId,
                
                // Prefill customer data
                prefill: {
                    name: orderData.userName,
                    email: orderData.userEmail,
                    contact: orderData.userPhone
                },

                // Theme customization
                theme: {
                    color: '#667eea'
                },

                // Success handler
                handler: async (response) => {
                    console.log('💳 Payment successful:', response);
                    await handlePaymentSuccess(response, booking.id);
                },

                // Modal settings
                modal: {
                    ondismiss: () => {
                        console.log('❌ Payment cancelled by user');
                        handlePaymentCancel();
                    },
                    
                    // Escape key handler
                    escape: true,
                    
                    // Animation
                    animation: true,
                    
                    // Confirm close
                    confirm_close: true
                },

                // Additional notes
                notes: {
                    bookingId: booking.id,
                    tourId: booking.tour.id
                }
            };

            // Step 3: Open Razorpay checkout
            console.log('🚀 Opening Razorpay checkout...');
            await paymentService.openRazorpayCheckout(razorpayOptions);

        } catch (err) {
            console.error('❌ Payment initiation failed:', err);
            const errorMessage = err.response?.data?.message || 
                               err.response?.data || 
                               err.message || 
                               'Failed to initiate payment. Please try again.';
            setError(errorMessage);
            
            if (onFailure) {
                onFailure(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle successful payment
     */
    const handlePaymentSuccess = async (razorpayResponse, bookingId) => {
        try {
            console.log('✅ Verifying payment...');

            // Verify payment with backend
            const verificationData = {
                razorpayOrderId: razorpayResponse.razorpay_order_id,
                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                razorpaySignature: razorpayResponse.razorpay_signature,
                bookingId: bookingId
            };

            const result = await paymentService.verifyPayment(verificationData);
            
            console.log('✅ Payment verified:', result);

            // Update booking status
            await bookingService.confirmBooking(bookingId);

            // Success callback
            if (onSuccess) {
                onSuccess(razorpayResponse, result);
            }

            // Navigate to success page
            navigate('/payment-success', {
                state: {
                    paymentId: razorpayResponse.razorpay_payment_id,
                    orderId: razorpayResponse.razorpay_order_id,
                    bookingId: bookingId,
                    amount: booking.totalPrice
                }
            });

        } catch (err) {
            console.error('❌ Payment verification failed:', err);
            const errorMessage = err.response?.data || 
                               err.message || 
                               'Payment verification failed';
            
            // Navigate to failure page
            navigate('/payment-failure', {
                state: {
                    error: errorMessage,
                    bookingId: bookingId
                }
            });
        }
    };

    /**
     * Handle payment cancellation
     */
    const handlePaymentCancel = () => {
        console.log('⚠️ Payment cancelled');
        setError('Payment was cancelled. Please try again when ready.');
        
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="payment-checkout">
            <div className="payment-card">
                {/* Payment Header */}
                <div className="payment-header">
                    <FaCreditCard className="payment-icon" />
                    <h2>Complete Your Payment</h2>
                    <p>Secure payment powered by Razorpay</p>
                </div>

                {/* Booking Summary */}
                <div className="booking-summary">
                    <h3>Booking Summary</h3>
                    
                    <div className="summary-row">
                        <span>Tour:</span>
                        <strong>{booking.tour.title}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Destination:</span>
                        <strong>{booking.tour.destination}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Number of Seats:</span>
                        <strong>{booking.numberOfSeats}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Tour Date:</span>
                        <strong>{new Date(booking.tour.startDate).toLocaleDateString('en-IN')}</strong>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-total">
                        <span>Total Amount:</span>
                        <div className="total-amount">
                            <FaRupeeSign />
                            <span>{booking.totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="payment-error">
                        {error}
                    </div>
                )}

                {/* Payment Button */}
                <button
                    className="btn-pay-now"
                    onClick={handlePayment}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            Processing...
                        </>
                    ) : (
                        <>
                            <FaLock /> Pay Securely
                        </>
                    )}
                </button>

                {/* Security Info */}
                <div className="security-info">
                    <FaLock className="lock-icon" />
                    <p>
                        Your payment information is secure. We use industry-standard 
                        encryption to protect your data.
                    </p>
                </div>

                {/* Payment Methods Info */}
                <div className="payment-methods">
                    <p>We accept:</p>
                    <div className="methods-icons">
                        <span>💳 Credit Card</span>
                        <span>💳 Debit Card</span>
                        <span>🏦 Net Banking</span>
                        <span>📱 UPI</span>
                        <span>📲 Wallets</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCheckout;