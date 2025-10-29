package com.tourbooking.tourservice.service;

import com.tourbooking.tourservice.email.EmailService;
import com.tourbooking.tourservice.model.Booking;
import com.tourbooking.tourservice.model.BookingStatus;
import com.tourbooking.tourservice.model.Tour;
import com.tourbooking.tourservice.model.User;
import com.tourbooking.tourservice.repository.BookingRepository;
import com.tourbooking.tourservice.repository.TourRepository;
import com.tourbooking.tourservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tourbooking.tourservice.exception.BadRequestException;
import com.tourbooking.tourservice.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TourRepository tourRepository;

    // Naya booking create karna
    @Transactional
    public Booking createBooking(Long userId, Long tourId, Integer numberOfSeats) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        if (tour.getAvailableSeats() < numberOfSeats) {
            throw new BadRequestException("Not enough seats available! Only " +
                    tour.getAvailableSeats() + " seats left.");
        }

        Double totalPrice = tour.getPrice() * numberOfSeats;

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTour(tour);
        booking.setNumberOfSeats(numberOfSeats);
        booking.setTotalPrice(totalPrice);
        booking.setStatus(BookingStatus.PENDING);

        tour.setAvailableSeats(tour.getAvailableSeats() - numberOfSeats);
        tourRepository.save(tour);

        Booking savedBooking = bookingRepository.save(booking);

        // Email send karna
        emailService.sendBookingConfirmationEmail(savedBooking);

        return savedBooking;
    }

    // Sabhi bookings list
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // ID se booking find karna
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    // User ki sab bookings
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    // Tour ki sab bookings
    public List<Booking> getBookingsByTourId(Long tourId) {
        return bookingRepository.findByTourId(tourId);
    }

    // Status se bookings filter
    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    @Transactional
    public Booking confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be confirmed!");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentStatus("PAID");
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled!");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel completed booking!");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        Tour tour = booking.getTour();
        tour.setAvailableSeats(tour.getAvailableSeats() + booking.getNumberOfSeats());
        tourRepository.save(tour);

        Booking savedBooking = bookingRepository.save(booking);

        // Cancellation email send karna
        emailService.sendBookingCancellationEmail(savedBooking);

        return savedBooking;
    }

    public Booking completeBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BadRequestException("Only CONFIRMED bookings can be completed!");
        }

        booking.setStatus(BookingStatus.COMPLETED);
        return bookingRepository.save(booking);
    }

    // Booking delete karna
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}