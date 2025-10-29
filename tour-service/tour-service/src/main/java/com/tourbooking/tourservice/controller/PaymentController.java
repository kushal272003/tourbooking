package com.tourbooking.tourservice.controller;

import com.razorpay.RazorpayException;
import com.tourbooking.tourservice.dto.PaymentResponse;
import com.tourbooking.tourservice.dto.PaymentVerificationRequest;
import com.tourbooking.tourservice.model.Payment;
import com.tourbooking.tourservice.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Payment order create karna (Razorpay pe)
    @PostMapping("/create-order/{bookingId}")
    public ResponseEntity<?> createPaymentOrder(@PathVariable Long bookingId) {
        try {
            PaymentResponse response = paymentService.createPaymentOrder(bookingId);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RazorpayException e) {
            return new ResponseEntity<>("Failed to create order: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Payment verify karna (frontend se aane ke baad)
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        try {
            String result = paymentService.verifyPayment(request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Payment failed handler
    @PostMapping("/failed")
    public ResponseEntity<String> handlePaymentFailure(
            @RequestParam String orderId,
            @RequestParam String reason) {
        paymentService.handlePaymentFailure(orderId, reason);
        return ResponseEntity.ok("Payment failure recorded");
    }

    // Sab payments list
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }

    // Payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        Payment payment = paymentService.getPaymentById(id).orElse(null);
        if (payment != null) {
            return ResponseEntity.ok(payment);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment not found");
    }

    // Booking ki payment details
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getPaymentByBookingId(@PathVariable Long bookingId) {
        Payment payment = paymentService.getPaymentByBookingId(bookingId).orElse(null);
        if (payment != null) {
            return ResponseEntity.ok(payment);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment not found for this booking");
    }
}