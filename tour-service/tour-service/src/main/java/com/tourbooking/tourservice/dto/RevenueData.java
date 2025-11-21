// src/main/java/com/tourbooking/tourservice/dto/RevenueData.java
package com.tourbooking.tourservice.dto;

public class RevenueData {
    private String date; // or month/year
    private Double revenue;
    private Integer bookingCount;

    public RevenueData() {
    }

    public RevenueData(String date, Double revenue, Integer bookingCount) {
        this.date = date;
        this.revenue = revenue;
        this.bookingCount = bookingCount;
    }

    // Getters & Setters
    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Double getRevenue() {
        return revenue;
    }

    public void setRevenue(Double revenue) {
        this.revenue = revenue;
    }

    public Integer getBookingCount() {
        return bookingCount;
    }

    public void setBookingCount(Integer bookingCount) {
        this.bookingCount = bookingCount;
    }
}