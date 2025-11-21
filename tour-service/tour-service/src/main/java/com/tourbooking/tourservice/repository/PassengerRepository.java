package com.tourbooking.tourservice.repository;

import com.tourbooking.tourservice.model.Passenger;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {

    // Booking ID se sab passengers
    List<Passenger> findByBookingId(Long bookingId);

    // Primary passenger find karna
    Optional<Passenger> findByBookingIdAndIsPrimary(Long bookingId, Boolean isPrimary);

    // Booking ke sab passengers delete karna

    @Transactional
    @Modifying
    @Query("DELETE FROM Passenger p WHERE p.booking.id = :bookingId")
    void deleteByBookingId(@Param("bookingId") Long bookingId);
}