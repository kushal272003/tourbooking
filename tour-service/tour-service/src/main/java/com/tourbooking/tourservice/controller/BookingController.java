package com.tourbooking.tourservice.controller;

import com.tourbooking.tourservice.dto.BookingDTO;
import com.tourbooking.tourservice.dto.DTOMapper;
import com.tourbooking.tourservice.model.Booking;
import com.tourbooking.tourservice.model.BookingStatus;
import com.tourbooking.tourservice.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Naya booking create karna
    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestParam Long userId,
            @RequestParam Long tourId,
            @RequestParam Integer numberOfSeats) {
        try {
            Booking booking = bookingService.createBooking(userId, tourId, numberOfSeats);
            BookingDTO bookingDTO = DTOMapper.toBookingDTO(booking);
            return new ResponseEntity<>(bookingDTO, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Sabhi bookings list
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(DTOMapper::toBookingDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(bookingDTOs, HttpStatus.OK);
    }

    // ID se booking find karna
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id).orElse(null);
        if (booking != null) {
            BookingDTO bookingDTO = DTOMapper.toBookingDTO(booking);
            return ResponseEntity.ok(bookingDTO);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found");
    }

    // User ki sab bookings
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingDTO>> getBookingsByUserId(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getBookingsByUserId(userId);
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(DTOMapper::toBookingDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(bookingDTOs, HttpStatus.OK);
    }

    // Tour ki sab bookings
    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<BookingDTO>> getBookingsByTourId(@PathVariable Long tourId) {
        List<Booking> bookings = bookingService.getBookingsByTourId(tourId);
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(DTOMapper::toBookingDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(bookingDTOs, HttpStatus.OK);
    }

    // Status se bookings filter
    @GetMapping("/status/{status}")
    public ResponseEntity<List<BookingDTO>> getBookingsByStatus(@PathVariable BookingStatus status) {
        List<Booking> bookings = bookingService.getBookingsByStatus(status);
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(DTOMapper::toBookingDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(bookingDTOs, HttpStatus.OK);
    }

    // Booking confirm karna
    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.confirmBooking(id);
            BookingDTO bookingDTO = DTOMapper.toBookingDTO(booking);
            return new ResponseEntity<>(bookingDTO, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Booking cancel karna
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.cancelBooking(id);
            BookingDTO bookingDTO = DTOMapper.toBookingDTO(booking);
            return new ResponseEntity<>(bookingDTO, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Booking complete karna
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.completeBooking(id);
            BookingDTO bookingDTO = DTOMapper.toBookingDTO(booking);
            return new ResponseEntity<>(bookingDTO, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Booking delete karna
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return new ResponseEntity<>("Booking deleted successfully", HttpStatus.OK);
    }
}