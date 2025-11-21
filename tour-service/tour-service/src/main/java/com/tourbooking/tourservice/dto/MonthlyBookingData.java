// src/main/java/com/tourbooking/tourservice/dto/MonthlyBookingData.java
package com.tourbooking.tourservice.dto;

public class MonthlyBookingData {
    private String month;
    private Integer confirmed;
    private Integer pending;
    private Integer cancelled;

    public MonthlyBookingData() {
    }

    public MonthlyBookingData(String month, Integer confirmed, Integer pending, Integer cancelled) {
        this.month = month;
        this.confirmed = confirmed;
        this.pending = pending;
        this.cancelled = cancelled;
    }

    // Getters & Setters
    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Integer getConfirmed() {
        return confirmed;
    }

    public void setConfirmed(Integer confirmed) {
        this.confirmed = confirmed;
    }

    public Integer getPending() {
        return pending;
    }

    public void setPending(Integer pending) {
        this.pending = pending;
    }

    public Integer getCancelled() {
        return cancelled;
    }

    public void setCancelled(Integer cancelled) {
        this.cancelled = cancelled;
    }
}