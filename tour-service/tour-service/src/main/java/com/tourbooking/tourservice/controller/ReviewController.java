package com.tourbooking.tourservice.controller;

import com.tourbooking.tourservice.model.Review;
import com.tourbooking.tourservice.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Create review
    @PostMapping
    public ResponseEntity<?> createReview(
            @RequestParam Long tourId,
            @RequestParam Long userId,
            @RequestParam Integer rating,
            @RequestParam String comment,
            @RequestParam(required = false) Long bookingId) {
        try {
            Review review = reviewService.createReview(tourId, userId, rating, comment, bookingId);
            return new ResponseEntity<>(review, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all reviews
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    // Get review by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getReviewById(@PathVariable Long id) {
        Review review = reviewService.getReviewById(id).orElse(null);
        if (review != null) {
            return ResponseEntity.ok(review);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found");
    }

    // Get reviews for a tour
    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<Review>> getReviewsByTourId(@PathVariable Long tourId) {
        List<Review> reviews = reviewService.getReviewsByTourId(tourId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    // Get reviews by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUserId(@PathVariable Long userId) {
        List<Review> reviews = reviewService.getReviewsByUserId(userId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    // Get tour rating stats
    @GetMapping("/stats/tour/{tourId}")
    public ResponseEntity<Map<String, Object>> getTourRatingStats(@PathVariable Long tourId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("averageRating", reviewService.getAverageRating(tourId));
        stats.put("totalReviews", reviewService.getReviewCount(tourId));
        return ResponseEntity.ok(stats);
    }

    // Update review
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestParam Integer rating,
            @RequestParam String comment) {
        try {
            Review review = reviewService.updateReview(id, userId, rating, comment);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete review
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestParam(defaultValue = "false") boolean isAdmin) {
        try {
            reviewService.deleteReview(id, userId, isAdmin);
            return ResponseEntity.ok("Review deleted successfully");
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}