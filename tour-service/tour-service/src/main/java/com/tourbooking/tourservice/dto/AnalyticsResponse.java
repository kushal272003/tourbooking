// src/main/java/com/tourbooking/tourservice/dto/AnalyticsResponse.java
package com.tourbooking.tourservice.dto;

import java.util.List;

public class AnalyticsResponse {
    private List<RevenueData> revenueData;
    private List<DestinationStats> popularDestinations;
    private List<TourRatingStats> topRatedTours;
    private List<UserGrowthData> userGrowth;
    private PaymentStats paymentStats;
    private BookingTrendsData bookingTrends;

    // Quick Stats
    private Double totalRevenue;
    private Integer totalBookings;
    private Integer totalUsers;
    private Integer activeTours;

    public AnalyticsResponse() {
    }

    // Getters & Setters
    public List<RevenueData> getRevenueData() {
        return revenueData;
    }

    public void setRevenueData(List<RevenueData> revenueData) {
        this.revenueData = revenueData;
    }

    public List<DestinationStats> getPopularDestinations() {
        return popularDestinations;
    }

    public void setPopularDestinations(List<DestinationStats> popularDestinations) {
        this.popularDestinations = popularDestinations;
    }

    public List<TourRatingStats> getTopRatedTours() {
        return topRatedTours;
    }

    public void setTopRatedTours(List<TourRatingStats> topRatedTours) {
        this.topRatedTours = topRatedTours;
    }

    public List<UserGrowthData> getUserGrowth() {
        return userGrowth;
    }

    public void setUserGrowth(List<UserGrowthData> userGrowth) {
        this.userGrowth = userGrowth;
    }

    public PaymentStats getPaymentStats() {
        return paymentStats;
    }

    public void setPaymentStats(PaymentStats paymentStats) {
        this.paymentStats = paymentStats;
    }

    public BookingTrendsData getBookingTrends() {
        return bookingTrends;
    }

    public void setBookingTrends(BookingTrendsData bookingTrends) {
        this.bookingTrends = bookingTrends;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Integer getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Integer totalBookings) {
        this.totalBookings = totalBookings;
    }

    public Integer getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Integer totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Integer getActiveTours() {
        return activeTours;
    }

    public void setActiveTours(Integer activeTours) {
        this.activeTours = activeTours;
    }
}