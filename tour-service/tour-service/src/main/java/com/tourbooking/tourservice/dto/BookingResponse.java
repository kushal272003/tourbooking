package com.tourbooking.tourservice.dto;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

public class BookingResponse {

    private Long bookingId;
    private Long userId;
    private String userName;              // ✅ ADD THIS
    private String userEmail;             // ✅ ADD THIS

    private Long tourId;
    private String tourTitle;
    private String tourDestination;
    private String tourImageUrl;
    private LocalDate tourStartDate;      // ✅ ADD THIS

    private Integer numberOfSeats;
    private Double totalPrice;
    private String contactEmail;
    private String contactPhone;
    private String status;
    private String paymentStatus;
    private LocalDateTime bookingDate;
    private List<PassengerInfo> passengers;

    // Constructors
    public BookingResponse() {
    }

    // ✅ ALL GETTERS AND SETTERS

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // ✅ NEW: User Name
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    // ✅ NEW: User Email
    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

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

    public String getTourDestination() {
        return tourDestination;
    }

    public void setTourDestination(String tourDestination) {
        this.tourDestination = tourDestination;
    }

    public String getTourImageUrl() {
        return tourImageUrl;
    }

    public void setTourImageUrl(String tourImageUrl) {
        this.tourImageUrl = tourImageUrl;
    }

    // ✅ NEW: Tour Start Date
    public LocalDate getTourStartDate() {
        return tourStartDate;
    }

    public void setTourStartDate(LocalDate tourStartDate) {
        this.tourStartDate = tourStartDate;
    }

    public Integer getNumberOfSeats() {
        return numberOfSeats;
    }

    public void setNumberOfSeats(Integer numberOfSeats) {
        this.numberOfSeats = numberOfSeats;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public List<PassengerInfo> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<PassengerInfo> passengers) {
        this.passengers = passengers;
    }

    // Inner class for passenger info
    public static class PassengerInfo {
        private String name;
        private Integer age;
        private String gender;
        private Boolean isPrimary;

        public PassengerInfo() {
        }

        public PassengerInfo(String name, Integer age, String gender, Boolean isPrimary) {
            this.name = name;
            this.age = age;
            this.gender = gender;
            this.isPrimary = isPrimary;
        }

        // Getters & Setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Integer getAge() {
            return age;
        }

        public void setAge(Integer age) {
            this.age = age;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public Boolean getIsPrimary() {
            return isPrimary;
        }

        public void setIsPrimary(Boolean isPrimary) {
            this.isPrimary = isPrimary;
        }
    }
}