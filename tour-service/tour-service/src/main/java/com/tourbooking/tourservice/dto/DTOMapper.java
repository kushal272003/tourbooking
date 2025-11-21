package com.tourbooking.tourservice.dto;

import com.tourbooking.tourservice.model.Booking;
import com.tourbooking.tourservice.model.Tour;
import com.tourbooking.tourservice.model.User;

public class DTOMapper {

    // User to UserDTO
    public static UserDTO toUserDTO(User user) {
        if (user == null) return null;

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());  // ← New line
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    // Tour to TourDTO
    public static TourDTO toTourDTO(Tour tour) {
        if (tour == null) return null;

        TourDTO dto = new TourDTO();
        dto.setId(tour.getId());
        dto.setTitle(tour.getTitle());
        dto.setDescription(tour.getDescription());
        dto.setDestination(tour.getDestination());
        dto.setPrice(tour.getPrice());
        dto.setDuration(tour.getDuration());
        dto.setStartDate(tour.getStartDate());
        dto.setEndDate(tour.getEndDate());
        dto.setAvailableSeats(tour.getAvailableSeats());
        dto.setTotalSeats(tour.getTotalSeats());
        dto.setImageUrl(tour.getImageUrl());
        dto.setCreatedAt(tour.getCreatedAt());
        dto.setUpdatedAt(tour.getUpdatedAt());
        return dto;
    }

    // Booking to BookingDTO
    public static BookingDTO toBookingDTO(Booking booking) {
        if (booking == null) return null;

        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setUser(toUserDTO(booking.getUser()));  // Password nahi jayega
        dto.setTour(toTourDTO(booking.getTour()));
        dto.setNumberOfSeats(booking.getNumberOfSeats());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setBookingDate(booking.getBookingDate());
        return dto;
    }
}