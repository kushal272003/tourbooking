// src/pages/BookingConfirmation.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bookingService from "../services/bookingService";
import paymentService from "../services/paymentService";

import {
  FaRupeeSign,
  FaMapMarkerAlt,
  FaCalendar,
  FaClock,
  FaUsers,
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

import "../assets/BookingConfirmation.css";

const BookingConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!state || !state.tour || !state.primaryPassenger) {
    navigate("/tours");
    return null;
  }

  const { 
    tour, 
    numberOfSeats, 
    totalPrice, 
    contactDetails,
    primaryPassenger,
    additionalPassengers 
  } = state;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ✅ MAIN BOOKING HANDLER
  const handleConfirmAndPay = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("🚀 ========== STEP 1: CREATING BOOKING ==========");

      const primaryPassengerDTO = {
        name: primaryPassenger.name,
        age: parseInt(primaryPassenger.age),
        gender: primaryPassenger.gender,
        idProof: primaryPassenger.idProof,
      };

      const additionalPassengersDTO = (additionalPassengers || []).map((p) => ({
        name: p.name,
        age: parseInt(p.age),
        gender: p.gender || null,
        idProof: p.idProof || null,
      }));

      const bookingPayload = {
        userId: user.id,
        tourId: tour.id,
        numberOfSeats: numberOfSeats,
        contactEmail: contactDetails.email,
        contactPhone: contactDetails.phone,
        primaryPassenger: primaryPassengerDTO,
        additionalPassengers: additionalPassengersDTO,
      };

      console.log("📦 Booking Payload:", JSON.stringify(bookingPayload, null, 2));

      // Create booking
      const bookingResponse = await bookingService.createBooking(bookingPayload);

      console.log("✅ Booking Response:", bookingResponse);
      console.log("📌 Booking ID:", bookingResponse.bookingId);
      console.log("📌 Tour Title:", bookingResponse.tourTitle);

      // Get booking ID
      const createdBookingId = bookingResponse.bookingId || bookingResponse.id;

      if (!createdBookingId) {
        throw new Error("❌ Booking ID missing in response!");
      }

      console.log("🚀 ========== STEP 2: INITIATING PAYMENT ==========");

      // Proceed to payment
      await initiatePayment(bookingResponse, createdBookingId);
      
    } catch (err) {
      console.error("❌ ========== BOOKING ERROR ==========");
      console.error("❌ Error Object:", err);
      console.error("❌ Error Message:", err.message);
      console.error("❌ Response Data:", err.response?.data);
      
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to process booking"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ PAYMENT INITIATION
  const initiatePayment = async (bookingResponse, bookingId) => {
    try {
      console.log("💳 Creating payment order...");
      console.log("💳 Booking ID for payment:", bookingId);

      const orderData = await paymentService.createPaymentOrder(bookingId);

      console.log("✅ Payment Order Data:", orderData);

      const razorpayOptions = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Tour Booking Service",
        description: `Payment for ${bookingResponse.tourTitle || tour.title}`,
        order_id: orderData.orderId,
        prefill: {
          name: primaryPassenger.name,
          email: contactDetails.email,
          contact: contactDetails.phone,
        },
        theme: { color: "#667eea" },
        method: {
          upi: true,
          card: true,
          wallet: true,
          netbanking: true,
        },
        handler: async (razorpayResponse) => {
          console.log("🎉 ========== RAZORPAY HANDLER CALLED ==========");
          console.log("💳 Razorpay Response:", razorpayResponse);
          await handlePaymentSuccess(razorpayResponse, bookingId, bookingResponse);
        },
        modal: {
          ondismiss: async () => {
            console.log("❌ ========== PAYMENT CANCELLED ==========");
            await handlePaymentCancel(bookingId);
          },
        },
      };

      console.log("🚀 Opening Razorpay Checkout Modal...");
      await paymentService.openRazorpayCheckout(razorpayOptions);
      console.log("✅ Razorpay Modal Opened");

    } catch (err) {
      console.error("❌ ========== PAYMENT INITIATION ERROR ==========");
      console.error("❌ Error:", err);
      setError("Failed to initiate payment");

      if (bookingId) {
        try {
          console.log("🔄 Cancelling booking due to payment initiation failure...");
          await bookingService.cancelBooking(bookingId);
          console.log("✅ Booking cancelled");
        } catch (cancelErr) {
          console.error("❌ Failed to cancel booking:", cancelErr);
        }
      }
    }
  };

  // ✅ PAYMENT SUCCESS HANDLER (MOST IMPORTANT)
  // ✅ UPDATED: Payment Success Handler (Without Manual Confirm)
const handlePaymentSuccess = async (razorpayResponse, bookingId, bookingResponse) => {
  console.log("🎉 ========== PAYMENT SUCCESS HANDLER START ==========");
  
  try {
    const verificationData = {
      razorpayOrderId: razorpayResponse.razorpay_order_id,
      razorpayPaymentId: razorpayResponse.razorpay_payment_id,
      razorpaySignature: razorpayResponse.razorpay_signature,
      bookingId: bookingId,
    };

    console.log("📤 Verifying payment...");
    
    // ✅ FIX: Check response properly
    const response = await paymentService.verifyPayment(verificationData);
    console.log("✅ Backend Response:", response);
    
    // ✅ Check if response contains error
    if (response && typeof response === 'string' && response.includes('issue')) {
      throw new Error(response);
    }

    console.log("✅ Payment verified and booking auto-confirmed!");

    // Navigate to success page
    setTimeout(() => {
      navigate("/payment-success", {
        state: {
          paymentId: razorpayResponse.razorpay_payment_id,
          orderId: razorpayResponse.razorpay_order_id,
          bookingId: bookingId,
          amount: totalPrice,
          tourTitle: bookingResponse.tourTitle || tour.title,
          tourImage: bookingResponse.tourImageUrl || tour.imageUrl,
        },
        replace: true
      });
    }, 100);

  } catch (err) {
    console.error("❌ Payment verification failed:", err);
    
    setTimeout(() => {
      navigate("/payment-failure", {
        state: { 
          error: err.response?.data?.message || err.message || "Payment verification failed",
          bookingId: bookingId
        },
        replace: true
      });
    }, 100);
  }
};
  // ✅ PAYMENT CANCEL HANDLER
  const handlePaymentCancel = async (bookingId) => {
    console.log("❌ Payment cancelled by user");
    try {
      await bookingService.cancelBooking(bookingId);
      console.log("✅ Booking cancelled successfully");
      setError("Payment cancelled. Booking has been cancelled.");
    } catch (err) {
      console.error("❌ Failed to cancel booking:", err);
    }
  };

  return (
    <div className="booking-confirmation-page">
      <div className="confirmation-container">
        <button onClick={() => navigate(-1)} className="btn-back">
          <FaArrowLeft /> Back
        </button>

        <h1>Confirm Your Booking</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="confirmation-grid">
          {/* Tour Details */}
          <div className="tour-summary">
            <img src={tour.imageUrl} alt={tour.title} />
            <h2>{tour.title}</h2>

            <div className="summary-details">
              <div className="detail-item">
                <FaMapMarkerAlt /> {tour.destination}
              </div>
              <div className="detail-item">
                <FaClock /> {tour.duration} Days
              </div>
              <div className="detail-item">
                <FaCalendar /> {formatDate(tour.startDate)}
              </div>
            </div>

            {/* Contact Details */}
            <div className="contact-info-summary">
              <h3>📧 Contact Information</h3>
              <p><FaEnvelope /> {contactDetails.email}</p>
              <p><FaPhone /> {contactDetails.phone}</p>
            </div>

            {/* Passenger Details */}
            <div className="passengers-summary">
              <h3>Passenger Details ({numberOfSeats} Passenger{numberOfSeats > 1 ? 's' : ''})</h3>

              <div className="passenger-detail-card primary-passenger">
                <h4>⭐ Primary Passenger</h4>
                <p><strong>Name:</strong> {primaryPassenger.name}</p>
                <p><strong>Age:</strong> {primaryPassenger.age} years</p>
                <p><strong>Gender:</strong> {primaryPassenger.gender}</p>
                <p><strong>ID Proof:</strong> {primaryPassenger.idProof}</p>
              </div>

              {additionalPassengers && additionalPassengers.length > 0 && (
                <>
                  <h4 className="additional-header">Additional Passengers</h4>
                  {additionalPassengers.map((p, index) => (
                    <div key={index} className="passenger-detail-card">
                      <h4>Passenger {index + 2}</h4>
                      <p><strong>Name:</strong> {p.name}</p>
                      <p><strong>Age:</strong> {p.age} years</p>
                      {p.gender && <p><strong>Gender:</strong> {p.gender}</p>}
                      {p.idProof && <p><strong>ID Proof:</strong> {p.idProof}</p>}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="booking-summary-card">
            <h3>Booking Summary</h3>

            <div className="summary-row">
              <span>Tour Price (per person)</span>
              <span>
                <FaRupeeSign /> {tour.price.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="summary-row">
              <span>Number of Passengers</span>
              <span>{numberOfSeats}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total Amount</span>
              <span>
                <FaRupeeSign /> {totalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              onClick={handleConfirmAndPay}
              disabled={loading}
              className="btn-confirm-pay"
            >
              {loading ? "Processing..." : "Confirm & Pay"}
            </button>

            <div className="payment-info">
              <p>✓ Secure payment via Razorpay</p>
              <p>✓ Instant confirmation</p>
              <p>✓ Free cancellation up to 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;