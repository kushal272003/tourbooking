// src/main/java/com/tourbooking/tourservice/dto/BookingTrendsData.java
package com.tourbooking.tourservice.dto;

import java.util.List;

public class BookingTrendsData {
    private List<MonthlyBookingData> monthlyData;
    private Integer confirmedCount;
    private Integer pendingCount;
    private Integer cancelledCount;

    public BookingTrendsData() {
    }

    // Getters & Setters
    public List<MonthlyBookingData> getMonthlyData() {
        return monthlyData;
    }

    public void setMonthlyData(List<MonthlyBookingData> monthlyData) {
        this.monthlyData = monthlyData;
    }

    public Integer getConfirmedCount() {
        return confirmedCount;
    }

    public void setConfirmedCount(Integer confirmedCount) {
        this.confirmedCount = confirmedCount;
    }

    public Integer getPendingCount() {
        return pendingCount;
    }

    public void setPendingCount(Integer pendingCount) {
        this.pendingCount = pendingCount;
    }

    public Integer getCancelledCount() {
        return cancelledCount;
    }

    public void setCancelledCount(Integer cancelledCount) {
        this.cancelledCount = cancelledCount;
    }
}