// src/main/java/com/tourbooking/tourservice/dto/UserGrowthData.java
package com.tourbooking.tourservice.dto;

public class UserGrowthData {
    private String month;
    private Integer newUsers;
    private Integer totalUsers;

    public UserGrowthData() {
    }

    public UserGrowthData(String month, Integer newUsers, Integer totalUsers) {
        this.month = month;
        this.newUsers = newUsers;
        this.totalUsers = totalUsers;
    }

    // Getters & Setters
    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Integer getNewUsers() {
        return newUsers;
    }

    public void setNewUsers(Integer newUsers) {
        this.newUsers = newUsers;
    }

    public Integer getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Integer totalUsers) {
        this.totalUsers = totalUsers;
    }
}