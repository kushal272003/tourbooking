package com.tourbooking.tourservice.service;

import com.tourbooking.tourservice.exception.BadRequestException;
import com.tourbooking.tourservice.exception.ResourceNotFoundException;
import com.tourbooking.tourservice.model.Booking;
import com.tourbooking.tourservice.model.Review;
import com.tourbooking.tourservice.model.Tour;
import com.tourbooking.tourservice.model.User;
import com.tourbooking.tourservice.repository.BookingRepository;
import com.tourbooking.tourservice.repository.ReviewRepository;
import com.tourbooking.tourservice.repository.TourRepository;
import com.tourbooking.tourservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // Create review
    @Transactional
    public Review createReview(Long tourId, Long userId, Integer rating, String comment, Long bookingId) {
        // Check tour exists
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        // Check user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if user already reviewed this tour
        if (reviewRepository.existsByTourIdAndUserId(tourId, userId)) {
            throw new BadRequestException("You have already reviewed this tour!");
        }

        // Optional: Check if user has completed booking for this tour
        if (bookingId != null) {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

            if (!booking.getUser().getId().equals(userId)) {
                throw new BadRequestException("This booking does not belong to you!");
            }

            if (!booking.getTour().getId().equals(tourId)) {
                throw new BadRequestException("This booking is not for this tour!");
            }
        }

        // Create review
        Review review = new Review();
        review.setTour(tour);
        review.setUser(user);
        review.setRating(rating);
        review.setComment(comment);

        if (bookingId != null) {
            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            review.setBooking(booking);
        }

        return reviewRepository.save(review);
    }

    // Get all reviews
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // Get review by ID
    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    // Get reviews for a tour
    public List<Review> getReviewsByTourId(Long tourId) {
        return reviewRepository.findByTourId(tourId);
    }

    // Get reviews by user
    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    // Get average rating for tour
    public Double getAverageRating(Long tourId) {
        Double avgRating = reviewRepository.getAverageRatingByTourId(tourId);
        return avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0;
    }

    // Get review count for tour
    public Long getReviewCount(Long tourId) {
        return reviewRepository.countByTourId(tourId);
    }

    // Update review
    @Transactional
    public Review updateReview(Long reviewId, Long userId, Integer rating, String comment) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        // Check if user owns this review
        if (!review.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only edit your own reviews!");
        }

        review.setRating(rating);
        review.setComment(comment);

        return reviewRepository.save(review);
    }

    // Delete review
    @Transactional
    public void deleteReview(Long reviewId, Long userId, boolean isAdmin) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        // Admin can delete any review, users can only delete their own
        if (!isAdmin && !review.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only delete your own reviews!");
        }

        reviewRepository.deleteById(reviewId);
    }
}