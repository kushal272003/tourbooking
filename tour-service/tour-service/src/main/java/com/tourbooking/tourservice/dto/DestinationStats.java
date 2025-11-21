// src/main/java/com/tourbooking/tourservice/dto/DestinationStats.java
package com.tourbooking.tourservice.dto;

public class DestinationStats {
    private String destination;
    private Integer bookingCount;
    private Double revenue;

    public DestinationStats() {
    }

    public DestinationStats(String destination, Integer bookingCount, Double revenue) {
        this.destination = destination;
        this.bookingCount = bookingCount;
        this.revenue = revenue;
    }

    // Getters & Setters
    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Integer getBookingCount() {
        return bookingCount;
    }

    public void setBookingCount(Integer bookingCount) {
        this.bookingCount = bookingCount;
    }

    public Double getRevenue() {
        return revenue;
    }

    public void setRevenue(Double revenue) {
        this.revenue = revenue;
    }
}