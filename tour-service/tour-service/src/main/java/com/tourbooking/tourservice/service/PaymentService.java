package com.tourbooking.tourservice.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.tourbooking.tourservice.dto.PaymentResponse;
import com.tourbooking.tourservice.dto.PaymentVerificationRequest;
import com.tourbooking.tourservice.exception.BadRequestException;
import com.tourbooking.tourservice.exception.ResourceNotFoundException;
import com.tourbooking.tourservice.model.Booking;
import com.tourbooking.tourservice.model.Payment;
import com.tourbooking.tourservice.repository.BookingRepository;
import com.tourbooking.tourservice.repository.PaymentRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Value("${razorpay.currency}")
    private String currency;

    @Value("${razorpay.company.name}")
    private String companyName;

    // Razorpay order create karna
    @Transactional
    public PaymentResponse createPaymentOrder(Long bookingId) throws RazorpayException {
        // Booking find karna
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Check booking already paid hai ya nahi
        if ("PAID".equals(booking.getPaymentStatus())) {
            throw new BadRequestException("Booking is already paid!");
        }

        // Razorpay client initialize
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        // Amount ko paise me convert (1 rupee = 100 paise)
        int amountInPaise = (int) (booking.getTotalPrice() * 100);

        // Order options
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", "BOOKING_" + bookingId);
        orderRequest.put("notes", new JSONObject()
                .put("bookingId", bookingId)
                .put("tourTitle", booking.getTour().getTitle())
                .put("userName", booking.getUser().getName())
        );

        // Razorpay pe order create
        Order order = razorpayClient.orders.create(orderRequest);

        // Payment record database me save
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setRazorpayOrderId(order.get("id"));
        payment.setAmount(booking.getTotalPrice());
        payment.setCurrency(currency);
        payment.setStatus("CREATED");

        paymentRepository.save(payment);

        // Response prepare
        PaymentResponse response = new PaymentResponse();
        response.setOrderId(order.get("id"));
        response.setCurrency(currency);
        response.setAmount(amountInPaise);
        response.setKey(razorpayKeyId);
        response.setBookingId(String.valueOf(bookingId));
        response.setUserName(booking.getUser().getName());
        response.setUserEmail(booking.getUser().getEmail());
        response.setUserPhone(booking.getUser().getPhone());

        return response;
    }

    // Payment verify karna (after successful payment from frontend)
    @Transactional
    public String verifyPayment(PaymentVerificationRequest request) {
        try {
            // Payment find karna
            Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found!"));

            // Signature verify karna (security check)
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValidSignature = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (isValidSignature) {
                // Payment success - update karo
                payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
                payment.setRazorpaySignature(request.getRazorpaySignature());
                payment.setStatus("SUCCESS");
                paymentRepository.save(payment);

                // Booking status update
                Booking booking = payment.getBooking();
                booking.setPaymentStatus("PAID");
                bookingRepository.save(booking);

                return "Payment verified successfully!";
            } else {
                // Signature invalid
                payment.setStatus("FAILED");
                paymentRepository.save(payment);

                throw new BadRequestException("Invalid payment signature!");
            }

        } catch (RazorpayException e) {
            throw new BadRequestException("Payment verification failed: " + e.getMessage());
        }
    }

    // Payment failed handler
    @Transactional
    public void handlePaymentFailure(String orderId, String reason) {
        Payment payment = paymentRepository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found!"));

        payment.setStatus("FAILED");
        paymentRepository.save(payment);
    }

    // Sab payments list
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Payment by ID
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    // Booking ki payment find karna
    public Optional<Payment> getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }
}