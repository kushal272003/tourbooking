import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendar,
  FaClock,
  FaUsers,
  FaRupeeSign,
  FaStar,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import "../assets/TourCard.css";
import reviewService from "../services/reviewService";
import wishlistService from "../services/wishlistService";
import { useAuth } from "../context/AuthContext";

const TourCard = ({ tour }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchRating();
  }, [tour.id]);

  useEffect(() => {
    if (isAuthenticated && user) {
      checkWishlistStatus();
    }
  }, [tour.id, isAuthenticated, user]);

  const checkWishlistStatus = async () => {
    try {
      const status = await wishlistService.checkWishlist(user.id, tour.id);
      setIsInWishlist(status);
    } catch (err) {
      console.error("Error checking wishlist:", err);
    }
  };

  const fetchRating = async () => {
    try {
      const stats = await reviewService.getTourRatingStats(tour.id);
      setAvgRating(stats.averageRating);
      setReviewCount(stats.totalReviews);
    } catch (err) {
      console.error("Error fetching rating:", err);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/tours/${id}`);
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("Please login to add to wishlist");
      navigate("/login");
      return;
    }

    setWishlistLoading(true);

    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(user.id, tour.id);
        setIsInWishlist(false);
      } else {
        await wishlistService.addToWishlist(user.id, tour.id);
        setIsInWishlist(true);
      }
    } catch (err) {
      alert(err.response?.data || "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  // Image error handler
  const handleImageError = (e) => {
    console.error("Image failed to load:", tour.imageUrl);
    setImageError(true);
    // Fallback to a nice placeholder image
    e.target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop";
  };

  // Get proper image URL
  const getImageUrl = () => {
    if (!tour.imageUrl || imageError) {
      return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop";
    }

    // If relative path, add backend URL
    if (tour.imageUrl.startsWith('/uploads') || tour.imageUrl.startsWith('/images')) {
      return `http://localhost:8080${tour.imageUrl}`;
    }

    // If it's already a full URL, return as is
    return tour.imageUrl;
  };

  return (
    <div className="tour-card">
     <div className="tour-image">


        <img 
         src={getImageUrl()} 
  alt={tour.title}
  onError={handleImageError}
  loading="lazy"
  
        />
        
        <div className="tour-badge">
          {tour.availableSeats > 0 ? (
            <span className="badge-available">AVAILABLE</span>
          ) : (
            <span className="badge-sold-out">SOLD OUT</span>
          )}
        </div>

        {/* Wishlist Heart Icon */}
        {isAuthenticated && (
          <button
            className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isInWishlist ? <FaHeart /> : <FaRegHeart />}
          </button>
        )}
      </div>

      <div className="tour-content">
        <h3 className="tour-title">{tour.title}</h3>

        {/* Rating Display */}
        {reviewCount > 0 && (
          <div className="tour-rating">
            <FaStar className="star-icon" />
            <span className="rating-value">{avgRating.toFixed(1)}</span>
            <span className="rating-count">({reviewCount} reviews)</span>
          </div>
        )}

        <div className="tour-info">
          <div className="info-item">
            <FaMapMarkerAlt className="icon" />
            <span>{tour.destination}</span>
          </div>

          <div className="info-item">
            <FaClock className="icon" />
            <span>{tour.duration} Days</span>
          </div>

          <div className="info-item">
            <FaCalendar className="icon" />
            <span>{new Date(tour.startDate).toLocaleDateString("en-IN")}</span>
          </div>

          <div className="info-item">
            <FaUsers className="icon" />
            <span>
              {tour.availableSeats} / {tour.totalSeats} Seats
            </span>
          </div>
        </div>

        <p className="tour-description">
          {tour.description.length > 100
            ? `${tour.description.substring(0, 100)}...`
            : tour.description}
        </p>

        <div className="tour-footer">
          <div className="tour-price">
            <FaRupeeSign className="rupee-icon" />
            <span className="price">{tour.price.toLocaleString("en-IN")}</span>
            <span className="per-person">/person</span>
          </div>

          <button
            className="btn-view-details"
            onClick={() => handleViewDetails(tour.id)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;