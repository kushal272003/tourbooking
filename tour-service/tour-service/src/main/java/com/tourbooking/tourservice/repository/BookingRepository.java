package com.tourbooking.tourservice.repository;

import com.tourbooking.tourservice.model.Booking;
import com.tourbooking.tourservice.model.BookingStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // User ki sab bookings
    List<Booking> findByUserId(Long userId);

    // Tour ki sab bookings
    List<Booking> findByTourId(Long tourId);

    // Status se bookings filter
    List<Booking> findByStatus(BookingStatus status);

    // User ki specific status wali bookings
    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);

    // Tour ki specific status wali bookings
    List<Booking> findByTourIdAndStatus(Long tourId, BookingStatus status);

    // Payment status se filter
    List<Booking> findByPaymentStatus(String paymentStatus);




}