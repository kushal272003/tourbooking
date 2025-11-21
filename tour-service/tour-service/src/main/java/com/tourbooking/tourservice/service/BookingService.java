package com.tourbooking.tourservice.service;

import com.tourbooking.tourservice.dto.AdditionalPassengerDTO;
import com.tourbooking.tourservice.dto.BookingRequest;
import com.tourbooking.tourservice.dto.BookingResponse;
import com.tourbooking.tourservice.dto.PrimaryPassengerDTO;
import com.tourbooking.tourservice.email.EmailService;
import com.tourbooking.tourservice.exception.BadRequestException;
import com.tourbooking.tourservice.exception.ResourceNotFoundException;
import com.tourbooking.tourservice.model.*;
import com.tourbooking.tourservice.repository.BookingRepository;
import com.tourbooking.tourservice.repository.PassengerRepository;
import com.tourbooking.tourservice.repository.TourRepository;
import com.tourbooking.tourservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TourRepository tourRepository;

    // ✅ UPDATED: New DTO structure with Primary + Additional passengers
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {

        // Validate User
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        // Validate Tour
        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + request.getTourId()));

        // Check availability
        if (tour.getAvailableSeats() < request.getNumberOfSeats()) {
            throw new BadRequestException("Not enough seats available! Only " +
                    tour.getAvailableSeats() + " seats left.");
        }

        // ✅ Validate total passenger count
        int totalPassengers = 1; // Primary passenger
        if (request.getAdditionalPassengers() != null) {
            totalPassengers += request.getAdditionalPassengers().size();
        }

        if (totalPassengers != request.getNumberOfSeats()) {
            throw new BadRequestException("Total passengers (" + totalPassengers +
                    ") must match number of seats (" + request.getNumberOfSeats() + ")");
        }

        // Calculate total price
        Double totalPrice = tour.getPrice() * request.getNumberOfSeats();

        // Create Booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTour(tour);
        booking.setNumberOfSeats(request.getNumberOfSeats());
        booking.setTotalPrice(totalPrice);
        booking.setStatus(BookingStatus.PENDING);
        booking.setPrimaryEmail(request.getContactEmail());
        booking.setPrimaryPhone(request.getContactPhone());

        // Save booking first (to get ID for passengers)
        Booking savedBooking = bookingRepository.save(booking);

        // ✅ Create Primary Passenger
        PrimaryPassengerDTO primaryDTO = request.getPrimaryPassenger();
        Passenger primaryPassenger = new Passenger();
        primaryPassenger.setName(primaryDTO.getName());
        primaryPassenger.setAge(primaryDTO.getAge());
        primaryPassenger.setGender(primaryDTO.getGender());
        primaryPassenger.setIdProof(primaryDTO.getIdProof());
        primaryPassenger.setIsPrimary(true);
        primaryPassenger.setBooking(savedBooking);
        passengerRepository.save(primaryPassenger);

        // ✅ Create Additional Passengers
        if (request.getAdditionalPassengers() != null && !request.getAdditionalPassengers().isEmpty()) {
            for (AdditionalPassengerDTO additionalDTO : request.getAdditionalPassengers()) {
                Passenger additionalPassenger = new Passenger();
                additionalPassenger.setName(additionalDTO.getName());
                additionalPassenger.setAge(additionalDTO.getAge());
                additionalPassenger.setGender(additionalDTO.getGender());
                additionalPassenger.setIdProof(additionalDTO.getIdProof()); // Can be null
                additionalPassenger.setIsPrimary(false);
                additionalPassenger.setBooking(savedBooking);
                passengerRepository.save(additionalPassenger);
            }
        }

        // Send email notification
        emailService.sendBookingConfirmationEmail(savedBooking);

        System.out.println("✅ Booking created (PENDING) with " + totalPassengers + " passengers");

        // Return response DTO
        return convertToResponse(savedBooking);
    }

    // Get all bookings
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get booking by ID
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return convertToResponse(booking);
    }

    // Get bookings by user ID
    public List<BookingResponse> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get bookings by tour ID
    public List<BookingResponse> getBookingsByTourId(Long tourId) {
        return bookingRepository.findByTourId(tourId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get bookings by status
    public List<BookingResponse> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Confirm booking
    // ✅ Option 2: Keep BookingResponse but wrap in try-catch
    @Transactional
    public BookingResponse confirmBooking(Long bookingId) {
        System.out.println("📤 Confirming booking: " + bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be confirmed!");
        }

        Tour tour = booking.getTour();

        if (tour.getAvailableSeats() < booking.getNumberOfSeats()) {
            throw new BadRequestException("Seats no longer available!");
        }

        // Deduct seats
        tour.setAvailableSeats(tour.getAvailableSeats() - booking.getNumberOfSeats());
        tourRepository.save(tour);

        // Update booking
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentStatus("PAID");

        Booking confirmedBooking = bookingRepository.save(booking);

        System.out.println("✅ Booking CONFIRMED - Seats deducted: " + booking.getNumberOfSeats());

        try {
            return convertToResponse(confirmedBooking);
        } catch (Exception e) {
            System.err.println("⚠️ Could not convert to response but booking is confirmed: " + e.getMessage());
            // Return minimal response
            BookingResponse response = new BookingResponse();
            response.setBookingId(confirmedBooking.getId());
            response.setStatus("CONFIRMED");
            return response;
        }
    }

    // Cancel booking
    @Transactional
    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled!");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel completed booking!");
        }

        // Restore seats if booking was confirmed
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            Tour tour = booking.getTour();
            tour.setAvailableSeats(tour.getAvailableSeats() + booking.getNumberOfSeats());
            tourRepository.save(tour);
            System.out.println("✅ Seats restored: " + booking.getNumberOfSeats());
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking cancelledBooking = bookingRepository.save(booking);

        // Send cancellation email
        emailService.sendBookingCancellationEmail(cancelledBooking);

        return convertToResponse(cancelledBooking);
    }

    // Complete booking
    @Transactional
    public BookingResponse completeBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BadRequestException("Only CONFIRMED bookings can be completed!");
        }

        booking.setStatus(BookingStatus.COMPLETED);
        Booking completedBooking = bookingRepository.save(booking);

        return convertToResponse(completedBooking);
    }

    // Delete booking
    @Transactional
    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        // Passengers will be deleted automatically due to cascade
        bookingRepository.delete(booking);
    }

    // ✅ Helper method: Convert Booking to BookingResponse
    // ✅ Updated helper method in BookingService.java

    // In BookingService.java - Update this method

    private BookingResponse convertToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();

        response.setBookingId(booking.getId());

        // ✅ SAFE: Don't include full User/Tour objects
        response.setUserId(booking.getUser().getId());
        response.setUserName(booking.getUser().getName());
        response.setUserEmail(booking.getUser().getEmail());

        response.setTourId(booking.getTour().getId());
        response.setTourTitle(booking.getTour().getTitle());
        response.setTourDestination(booking.getTour().getDestination());
        response.setTourImageUrl(booking.getTour().getImageUrl());
        response.setTourStartDate(booking.getTour().getStartDate());

        response.setNumberOfSeats(booking.getNumberOfSeats());
        response.setTotalPrice(booking.getTotalPrice());
        response.setContactEmail(booking.getPrimaryEmail());
        response.setContactPhone(booking.getPrimaryPhone());
        response.setStatus(booking.getStatus().toString());
        response.setPaymentStatus(booking.getPaymentStatus());
        response.setBookingDate(booking.getBookingDate());

        // ✅ Get passengers safely
        try {
            List<Passenger> passengers = passengerRepository.findByBookingId(booking.getId());
            List<BookingResponse.PassengerInfo> passengerInfos = passengers.stream()
                    .map(p -> new BookingResponse.PassengerInfo(
                            p.getName(),
                            p.getAge(),
                            p.getGender(),
                            p.getIsPrimary()
                    ))
                    .collect(Collectors.toList());
            response.setPassengers(passengerInfos);
        } catch (Exception e) {
            System.err.println("⚠️ Could not load passengers: " + e.getMessage());
            response.setPassengers(new ArrayList<>());
        }

        return response;
    }
}