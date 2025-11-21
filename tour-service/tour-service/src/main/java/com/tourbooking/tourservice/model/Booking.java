package com.tourbooking.tourservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore  // ✅ Add this to prevent circular reference
    private User user;

    @ManyToOne
    @JoinColumn(name = "tour_id", nullable = false)
    @JsonIgnore  // ✅ Add this to prevent circular reference
    private Tour tour;
    @Column(name = "number_of_seats", nullable = false)
    private Integer numberOfSeats;
    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @NotBlank(message = "Primary contact email is required")
    @Email(message = "Email should be valid")
    @Column(name = "primary_email", nullable = false, length = 100)
    private String primaryEmail;

    @NotBlank(message = "Primary contact phone is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    @Column(name = "primary_phone", nullable = false, length = 15)
    private String primaryPhone;



    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookingStatus status;
    @Column(name = "booking_date", nullable = false, updatable = false)
    private LocalDateTime bookingDate;
    @Column(name = "payment_status", length = 20)
    private String paymentStatus;
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Passenger> passengers = new ArrayList<>();

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

    public Booking(Long id, User user, Tour tour, Integer numberOfSeats, Double totalPrice, String primaryEmail, String primaryPhone, BookingStatus status, LocalDateTime bookingDate, String paymentStatus, List<Passenger> passengers) {
        this.id = id;
        this.user = user;
        this.tour = tour;
        this.numberOfSeats = numberOfSeats;
        this.totalPrice = totalPrice;
        this.primaryEmail = primaryEmail;
        this.primaryPhone = primaryPhone;
        this.status = status;
        this.bookingDate = bookingDate;
        this.paymentStatus = paymentStatus;
        this.passengers = passengers;
    }

    public String getPrimaryEmail() {
        return primaryEmail;
    }

    public void setPrimaryEmail(String primaryEmail) {
        this.primaryEmail = primaryEmail;
    }

    public String getPrimaryPhone() {
        return primaryPhone;
    }

    public void setPrimaryPhone(String primaryPhone) {
        this.primaryPhone = primaryPhone;
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

    public List<Passenger> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<Passenger> passengers) {
        this.passengers = passengers;
    }

    public void addPassenger(Passenger passenger) {
        passengers.add(passenger);
        passenger.setBooking(this);
    }

    public void removePassenger(Passenger passenger) {
        passengers.remove(passenger);
        passenger.setBooking(null);
    }
}
