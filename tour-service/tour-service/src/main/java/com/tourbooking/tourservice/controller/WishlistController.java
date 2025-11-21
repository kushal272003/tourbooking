package com.tourbooking.tourservice.controller;

import com.tourbooking.tourservice.model.Wishlist;
import com.tourbooking.tourservice.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // Add to wishlist
    @PostMapping
    public ResponseEntity<?> addToWishlist(
            @RequestParam Long userId,
            @RequestParam Long tourId) {
        try {
            Wishlist wishlist = wishlistService.addToWishlist(userId, tourId);
            return new ResponseEntity<>(wishlist, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Remove from wishlist
    @DeleteMapping
    public ResponseEntity<String> removeFromWishlist(
            @RequestParam Long userId,
            @RequestParam Long tourId) {
        try {
            wishlistService.removeFromWishlist(userId, tourId);
            return ResponseEntity.ok("Tour removed from wishlist");
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get user's wishlist
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Wishlist>> getUserWishlist(@PathVariable Long userId) {
        List<Wishlist> wishlist = wishlistService.getUserWishlist(userId);
        return ResponseEntity.ok(wishlist);
    }

    // Check if tour is in wishlist
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(
            @RequestParam Long userId,
            @RequestParam Long tourId) {
        boolean isInWishlist = wishlistService.isInWishlist(userId, tourId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isInWishlist", isInWishlist);
        return ResponseEntity.ok(response);
    }

    // Get wishlist count
    @GetMapping("/count/{userId}")
    public ResponseEntity<Map<String, Long>> getWishlistCount(@PathVariable Long userId) {
        Long count = wishlistService.getWishlistCount(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    // Clear wishlist
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<String> clearWishlist(@PathVariable Long userId) {
        wishlistService.clearWishlist(userId);
        return ResponseEntity.ok("Wishlist cleared");
    }
}