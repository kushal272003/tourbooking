package com.tourbooking.tourservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")

public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @Column(name = "number_of_seats", nullable = false)
    private Integer numberOfSeats;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookingStatus status;

    @Column(name = "booking_date", nullable = false, updatable = false)
    private LocalDateTime bookingDate;

    @Column(name = "payment_status", length = 20)
    private String paymentStatus;

    @PrePersist
    protected void onCreate() {
        bookingDate = LocalDateTime.now();
        if (status == null) {
            status = BookingStatus.PENDING;
        }
        if (paymentStatus == null) {
            paymentStatus = "PENDING";
        }
    }

    public Booking() {
    }

    public Booking(Long id, User user, Tour tour, Integer numberOfSeats, Double totalPrice, BookingStatus status, LocalDateTime bookingDate, String paymentStatus) {
        this.id = id;
        this.user = user;
        this.tour = tour;
        this.numberOfSeats = numberOfSeats;
        this.totalPrice = totalPrice;
        this.status = status;
        this.bookingDate = bookingDate;
        this.paymentStatus = paymentStatus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Tour getTour() {
        return tour;
    }

    public void setTour(Tour tour) {
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

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}