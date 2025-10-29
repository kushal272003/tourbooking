package com.tourbooking.tourservice.service;

import com.tourbooking.tourservice.exception.BadRequestException;
import com.tourbooking.tourservice.exception.ResourceNotFoundException;
import com.tourbooking.tourservice.model.Tour;
import com.tourbooking.tourservice.model.User;
import com.tourbooking.tourservice.model.Wishlist;
import com.tourbooking.tourservice.repository.TourRepository;
import com.tourbooking.tourservice.repository.UserRepository;
import com.tourbooking.tourservice.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TourRepository tourRepository;

    // Add tour to wishlist
    @Transactional
    public Wishlist addToWishlist(Long userId, Long tourId) {
        // Check user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check tour exists
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        // Check if already in wishlist
        if (wishlistRepository.existsByUserIdAndTourId(userId, tourId)) {
            throw new BadRequestException("Tour is already in your wishlist!");
        }

        // Create wishlist item
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setTour(tour);

        return wishlistRepository.save(wishlist);
    }

    // Remove from wishlist
    @Transactional
    public void removeFromWishlist(Long userId, Long tourId) {
        if (!wishlistRepository.existsByUserIdAndTourId(userId, tourId)) {
            throw new ResourceNotFoundException("Tour not found in wishlist");
        }

        wishlistRepository.deleteByUserIdAndTourId(userId, tourId);
    }

    // Get user's wishlist
    public List<Wishlist> getUserWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    // Check if tour is in wishlist
    public boolean isInWishlist(Long userId, Long tourId) {
        return wishlistRepository.existsByUserIdAndTourId(userId, tourId);
    }

    // Get wishlist count
    public Long getWishlistCount(Long userId) {
        return wishlistRepository.countByUserId(userId);
    }

    // Clear wishlist
    @Transactional
    public void clearWishlist(Long userId) {
        List<Wishlist> items = wishlistRepository.findByUserId(userId);
        wishlistRepository.deleteAll(items);
    }
}