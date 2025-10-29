import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendar,
  FaClock,
  FaUsers,
  FaRupeeSign,
} from "react-icons/fa";
import "../assets/TourCard.css";
import { useState, useEffect } from "react";
import reviewService from "../services/reviewService";
import { FaStar } from "react-icons/fa";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import wishlistService from "../services/wishlistService";
import { useAuth } from "../context/AuthContext";

const TourCard = ({ tour }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/tours/${tour.id}`);
  };
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    fetchRating();
  }, [tour.id]);
  const { user, isAuthenticated } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

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

  const handleWishlistToggle = async (e) => {
    e.stopPropagation(); // Prevent card click

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

  // Default image agar imageUrl nahi hai
  const imageUrl =
    tour.imageUrl || "https://via.placeholder.com/400x250?text=Tour+Image";

  return (
    <div className="tour-card">
      <div className="tour-image">
        <div className="tour-image">
          <img src={imageUrl} alt={tour.title} />
          <div className="tour-badge">
            {tour.availableSeats > 0 ? (
              <span className="badge-available">Available</span>
            ) : (
              <span className="badge-sold-out">Sold Out</span>
            )}
          </div>

          {/* Wishlist Heart Icon */}
          {isAuthenticated && (
            <button
              className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
            >
              {isInWishlist ? <FaHeart /> : <FaRegHeart />}
            </button>
          )}
        </div>
        <img src={imageUrl} alt={tour.title} />
        <div className="tour-badge">
          {tour.availableSeats > 0 ? (
            <span className="badge-available">Available</span>
          ) : (
            <span className="badge-sold-out">Sold Out</span>
          )}
        </div>
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

          <button className="btn-view-details" onClick={handleViewDetails}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
