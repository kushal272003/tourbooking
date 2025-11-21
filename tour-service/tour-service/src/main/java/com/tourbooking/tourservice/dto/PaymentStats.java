// src/main/java/com/tourbooking/tourservice/dto/PaymentStats.java
package com.tourbooking.tourservice.dto;

public class PaymentStats {
    private Integer totalTransactions;
    private Integer successfulPayments;
    private Integer failedPayments;
    private Double successRate;
    private Double totalRevenue;

    public PaymentStats() {
    }

    public PaymentStats(Integer totalTransactions, Integer successfulPayments, Integer failedPayments, Double successRate, Double totalRevenue) {
        this.totalTransactions = totalTransactions;
        this.successfulPayments = successfulPayments;
        this.failedPayments = failedPayments;
        this.successRate = successRate;
        this.totalRevenue = totalRevenue;
    }

    // Getters & Setters
    public Integer getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(Integer totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public Integer getSuccessfulPayments() {
        return successfulPayments;
    }

    public void setSuccessfulPayments(Integer successfulPayments) {
        this.successfulPayments = successfulPayments;
    }

    public Integer getFailedPayments() {
        return failedPayments;
    }

    public void setFailedPayments(Integer failedPayments) {
        this.failedPayments = failedPayments;
    }

    public Double getSuccessRate() {
        return successRate;
    }

    public void setSuccessRate(Double successRate) {
        this.successRate = successRate;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}