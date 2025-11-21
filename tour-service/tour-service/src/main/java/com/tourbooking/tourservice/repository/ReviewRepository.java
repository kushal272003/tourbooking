package com.tourbooking.tourservice.repository;

import com.tourbooking.tourservice.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Tour ki sab reviews
    List<Review> findByTourId(Long tourId);

    // User ki sab reviews
    List<Review> findByUserId(Long userId);

    // Check if user already reviewed this tour
    boolean existsByTourIdAndUserId(Long tourId, Long userId);

    // Get user's review for specific tour
    Optional<Review> findByTourIdAndUserId(Long tourId, Long userId);

    // Get average rating for a tour
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.tour.id = :tourId")
    Double getAverageRatingByTourId(Long tourId);

    // Count reviews for a tour
    Long countByTourId(Long tourId);
}