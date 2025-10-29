import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import tourService from "../services/tourService";
import bookingService from "../services/bookingService";
import {
  FaMapMarkerAlt,
  FaCalendar,
  FaClock,
  FaUsers,
  FaRupeeSign,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import "../assets/TourDetails.css";
import reviewService from "../services/reviewService";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState({
    averageRating: 0,
    totalReviews: 0,
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    comment: "",
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    fetchTourDetails();
    fetchReviews();
  }, [id]);

  const fetchTourDetails = async () => {
    setLoading(true);
    setError("");
   

    try {
      console.log("Fetching tour with ID:", id); // Debug log
      const data = await tourService.getTourById(id);
      console.log("Tour data received:", data); // Debug log
      setTour(data);
    } catch (err) {
      console.error("Error fetching tour:", err); // Debug log
      console.error("Error response:", err.response); // Debug log
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to load tour details"
      );
    } finally {
      setLoading(false);
    }
  };
   const fetchReviews = async () => {
    try {
        const reviewsData = await reviewService.getTourReviews(id);
        setReviews(reviewsData);
        
        const stats = await reviewService.getTourRatingStats(id);
        setRatingStats(stats);
    } catch (err) {
        console.error('Error fetching reviews:', err);
    }
};
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
        alert('Please login to write a review');
        navigate('/login');
        return;
    }

    if (reviewFormData.comment.trim().length < 10) {
        alert('Review must be at least 10 characters long');
        return;
    }

    setReviewSubmitting(true);

    try {
        await reviewService.createReview(
            tour.id,
            user.id,
            reviewFormData.rating,
            reviewFormData.comment
        );
        
        alert('Review submitted successfully!');
        setShowReviewForm(false);
        setReviewFormData({ rating: 5, comment: '' });
        fetchReviews(); // Refresh reviews
        
    } catch (err) {
        alert(err.response?.data || 'Failed to submit review. You may have already reviewed this tour.');
    } finally {
        setReviewSubmitting(false);
    }
};

  const handleBooking = async () => {
    if (!isAuthenticated) {
      alert("Please login to book a tour");
      navigate("/login");
      return;
    }

    console.log("User:", user); // Debug log
    console.log("User ID:", user.id); // Debug log
    console.log("Tour ID:", tour.id); // Debug log
    console.log("Number of Seats:", numberOfSeats); // Debug log

    if (!user.id) {
      alert("User ID not found. Please logout and login again.");
      return;
    }

    if (numberOfSeats < 1 || numberOfSeats > tour.availableSeats) {
      alert(`Please select between 1 and ${tour.availableSeats} seats`);
      return;
    }

    setBookingLoading(true);
    setError("");

    try {
      const booking = await bookingService.createBooking(
        user.id,
        tour.id,
        numberOfSeats
      );
      console.log("Booking response:", booking); // Debug log
      setBookingSuccess(true);

      fetchTourDetails();

      setTimeout(() => {
        navigate("/my-bookings");
      }, 3000);
    } catch (err) {
      console.error("Booking error:", err); // Debug log
      console.error("Error response:", err.response); // Debug log
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Booking failed. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };
  const calculateTotalPrice = () => {
    return tour ? (tour.price * numberOfSeats).toLocaleString("en-IN") : 0;
  };
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars.push(<FaStar key={i} className="star filled" />);
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars.push(<FaStarHalfAlt key={i} className="star filled" />);
        } else {
            stars.push(<FaRegStar key={i} className="star empty" />);
        }
    }
    
    return <div className="stars-container">{stars}</div>;
};


  

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  

  if (loading) {
    return <div className="loading-page">Loading tour details...</div>;
  }

  if (error && !tour) {
    return (
      <div className="error-page">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/tours")} className="btn-back">
          Back to Tours
        </button>
      </div>
    );
  }

  const imageUrl =
    tour.imageUrl || "https://via.placeholder.com/800x400?text=Tour+Image";

  return (
    <div className="tour-details-page">
      <div className="tour-details-container">
        <button onClick={() => navigate("/tours")} className="btn-back">
          <FaArrowLeft /> Back to Tours
        </button>

        {bookingSuccess && (
          <div className="success-message">
            <FaCheckCircle className="success-icon" />
            <h3>Booking Successful!</h3>
            <p>Your tour has been booked. Redirecting to your bookings...</p>
          </div>
        )}

        <div className="tour-hero">
          <img src={imageUrl} alt={tour.title} />
          <div className="tour-badge-large">
            {tour.availableSeats > 0 ? (
              <span className="badge-available">Available</span>
            ) : (
              <span className="badge-sold-out">Sold Out</span>
            )}
          </div>
        </div>

        <div className="tour-content-grid">
          <div className="tour-main-content">
            <h1 className="tour-title">{tour.title}</h1>      {/* Reviews Section */}
<div className="reviews-section">
    <div className="reviews-header">
        <div className="rating-summary">
            <div className="avg-rating">
                <span className="rating-number">{ratingStats.averageRating.toFixed(1)}</span>
                {renderStars(ratingStats.averageRating)}
            </div>
            <p className="reviews-count">
                Based on {ratingStats.totalReviews} review{ratingStats.totalReviews !== 1 ? 's' : ''}
            </p>
        </div>

        {isAuthenticated && !showReviewForm && (
            <button 
                className="btn-write-review"
                onClick={() => setShowReviewForm(true)}
            >
                Write a Review
            </button>
        )}
    </div>

    {/* Review Form */}
    {showReviewForm && (
        <div className="review-form-container">
            <h3>Write Your Review</h3>
            <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="form-group">
                    <label>Your Rating</label>
                    <div className="rating-input">
                        {[1, 2, 3, 4, 5].map(star => (
                            <FaStar
                                key={star}
                                className={`star-input ${star <= reviewFormData.rating ? 'active' : ''}`}
                                onClick={() => setReviewFormData({...reviewFormData, rating: star})}
                            />
                        ))}
                        <span className="rating-text">{reviewFormData.rating} star{reviewFormData.rating !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Your Review</label>
                    <textarea
                        value={reviewFormData.comment}
                        onChange={(e) => setReviewFormData({...reviewFormData, comment: e.target.value})}
                        placeholder="Share your experience with this tour..."
                        rows="5"
                        required
                        minLength="10"
                    />
                    <small>{reviewFormData.comment.length} characters (minimum 10)</small>
                </div>

                <div className="form-actions">
                    <button 
                        type="button" 
                        className="btn-cancel"
                        onClick={() => {
                            setShowReviewForm(false);
                            setReviewFormData({ rating: 5, comment: '' });
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="btn-submit"
                        disabled={reviewSubmitting}
                    >
                        {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </form>
        </div>
    )}

    {/* Reviews List */}
    <div className="reviews-list">
        {reviews.length === 0 ? (
            <div className="no-reviews">
                <p>No reviews yet. Be the first to review this tour!</p>
            </div>
        ) : (
            reviews.map(review => (
                <div key={review.id} className="review-card">
                    <div className="review-header">
                        <div className="reviewer-info">
                            <div className="reviewer-avatar">
                                {review.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4>{review.user.name}</h4>
                                <p className="review-date">{formatDate(review.createdAt)}</p>
                            </div>
                        </div>
                        <div className="review-rating">
                            {renderStars(review.rating)}
                        </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                </div>
            ))
        )}
    </div>
</div>

            <div className="tour-meta">
              <div className="meta-item">
                <FaMapMarkerAlt className="icon" />
                <div>
                  <span className="meta-label">Destination</span>
                  <span className="meta-value">{tour.destination}</span>
                </div>
              </div>

              <div className="meta-item">
                <FaClock className="icon" />
                <div>
                  <span className="meta-label">Duration</span>
                  <span className="meta-value">{tour.duration} Days</span>
                </div>
              </div>

              <div className="meta-item">
                <FaCalendar className="icon" />
                <div>
                  <span className="meta-label">Start Date</span>
                  <span className="meta-value">
                    {formatDate(tour.startDate)}
                  </span>
                </div>
              </div>

              <div className="meta-item">
                <FaUsers className="icon" />
                <div>
                  <span className="meta-label">Available Seats</span>
                  <span className="meta-value">
                    {tour.availableSeats} / {tour.totalSeats}
                  </span>
                </div>
              </div>
            </div>
      

            <div className="tour-description-section">
              <h2>About This Tour</h2>
              <p className="tour-description">{tour.description}</p>
            </div>

            <div className="tour-dates">
              <h3>Tour Schedule</h3>
              <div className="dates-info">
                <div className="date-box">
                  <span className="date-label">Starts</span>
                  <span className="date-value">
                    {formatDate(tour.startDate)}
                  </span>
                </div>
                <div className="date-arrow">→</div>
                <div className="date-box">
                  <span className="date-label">Ends</span>
                  <span className="date-value">{formatDate(tour.endDate)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="tour-booking-card">
            <div className="booking-price">
              <FaRupeeSign className="rupee-icon" />
              <span className="price">
                {tour.price.toLocaleString("en-IN")}
              </span>
              <span className="per-person">/person</span>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="booking-form">
              <label>Number of Seats</label>
              <input
                type="number"
                min="1"
                max={tour.availableSeats}
                value={numberOfSeats}
                onChange={(e) => setNumberOfSeats(parseInt(e.target.value))}
                disabled={tour.availableSeats === 0}
              />

              <div className="total-price">
                <span>Total Price:</span>
                <span className="total-amount">
                  <FaRupeeSign /> {calculateTotalPrice()}
                </span>
              </div>

              <button
                onClick={handleBooking}
                disabled={
                  bookingLoading || tour.availableSeats === 0 || bookingSuccess
                }
                className="btn-book"
              >
                {bookingLoading
                  ? "Booking..."
                  : tour.availableSeats === 0
                  ? "Sold Out"
                  : bookingSuccess
                  ? "Booked!"
                  : "Book Now"}
              </button>
            </div>

            <div className="booking-info">
              <p>✓ Instant confirmation</p>
              <p>✓ Free cancellation up to 24 hours</p>
              <p>✓ Reserve now & pay later</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
