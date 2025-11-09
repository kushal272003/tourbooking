package com.tourbooking.tourservice.repository;

import com.tourbooking.tourservice.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Booking ID se payment find karna
    Optional<Payment> findByBookingId(Long bookingId);

    // Razorpay Order ID se payment find karna
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    // Razorpay Payment ID se payment find karna
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    void deleteByBookingId(Long id);
}
