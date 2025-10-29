package com.tourbooking.tourservice.dto;

import com.tourbooking.tourservice.model.BookingStatus;


import java.time.LocalDateTime;


public class BookingDTO {

    private Long id;
    private UserDTO user;  // UserDTO use kar rahe (password nahi dikhega)
    private TourDTO tour;  // TourDTO use karenge
    private Integer numberOfSeats;
    private Double totalPrice;
    private BookingStatus status;
    private String paymentStatus;
    private LocalDateTime bookingDate;

    public BookingDTO() {
    }

    public BookingDTO(Long id, UserDTO user, TourDTO tour, Integer numberOfSeats, Double totalPrice, BookingStatus status, String paymentStatus, LocalDateTime bookingDate) {
        this.id = id;
        this.user = user;
        this.tour = tour;
        this.numberOfSeats = numberOfSeats;
        this.totalPrice = totalPrice;
        this.status = status;
        this.paymentStatus = paymentStatus;
        this.bookingDate = bookingDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public TourDTO getTour() {
        return tour;
    }

    public void setTour(TourDTO tour) {
        this.tour = tour;
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

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
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
}