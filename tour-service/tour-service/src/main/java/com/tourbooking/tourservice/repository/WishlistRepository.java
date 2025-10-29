package com.tourbooking.tourservice.repository;

import com.tourbooking.tourservice.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    // User ki sab wishlist items
    List<Wishlist> findByUserId(Long userId);

    // Check if tour is in user's wishlist
    boolean existsByUserIdAndTourId(Long userId, Long tourId);

    // Get specific wishlist item
    Optional<Wishlist> findByUserIdAndTourId(Long userId, Long tourId);

    // Delete by user and tour
    void deleteByUserIdAndTourId(Long userId, Long tourId);

    // Count wishlist items for user
    Long countByUserId(Long userId);
}