// src/main/java/com/tourbooking/tourservice/dto/TourRatingStats.java
package com.tourbooking.tourservice.dto;

public class TourRatingStats {
    private Long tourId;
    private String tourTitle;
    private Double averageRating;
    private Integer totalReviews;
    private Integer totalBookings;

    public TourRatingStats() {
    }

    public TourRatingStats(Long tourId, String tourTitle, Double averageRating, Integer totalReviews, Integer totalBookings) {
        this.tourId = tourId;
        this.tourTitle = tourTitle;
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
        this.totalBookings = totalBookings;
    }

    // Getters & Setters
    public Long getTourId() {
        return tourId;
    }

    public void setTourId(Long tourId) {
        this.tourId = tourId;
    }

    public String getTourTitle() {
        return tourTitle;
    }

    public void setTourTitle(String tourTitle) {
        this.tourTitle = tourTitle;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Integer totalReviews) {
        this.totalReviews = totalReviews;
    }

    public Integer getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Integer totalBookings) {
        this.totalBookings = totalBookings;
    }
}