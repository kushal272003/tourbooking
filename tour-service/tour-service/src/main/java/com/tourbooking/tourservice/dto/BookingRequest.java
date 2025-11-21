package com.tourbooking.tourservice.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public class BookingRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Tour ID is required")
    private Long tourId;

    @NotNull(message = "Number of seats is required")
    @Min(value = 1, message = "At least 1 seat required")
    private Integer numberOfSeats;

    // ✅ Common Contact Details (for all passengers)
    @NotBlank(message = "Contact email is required")
    @Email(message = "Valid email required")
    private String contactEmail;

    @NotBlank(message = "Contact phone is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String contactPhone;

    // ✅ Primary Passenger Details
    @NotNull(message = "Primary passenger details required")
    @Valid
    private PrimaryPassengerDTO primaryPassenger;

    // ✅ Additional Passengers (Optional for single booking)
    @Valid
    private List<AdditionalPassengerDTO> additionalPassengers;

    // Constructors
    public BookingRequest() {
    }

    public BookingRequest(Long userId, Long tourId, Integer numberOfSeats,
                          String contactEmail, String contactPhone,
                          PrimaryPassengerDTO primaryPassenger,
                          List<AdditionalPassengerDTO> additionalPassengers) {
        this.userId = userId;
        this.tourId = tourId;
        this.numberOfSeats = numberOfSeats;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.primaryPassenger = primaryPassenger;
        this.additionalPassengers = additionalPassengers;
    }

    // Getters & Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getTourId() {
        return tourId;
    }

    public void setTourId(Long tourId) {
        this.tourId = tourId;
    }

    public Integer getNumberOfSeats() {
        return numberOfSeats;
    }

    public void setNumberOfSeats(Integer numberOfSeats) {
        this.numberOfSeats = numberOfSeats;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public PrimaryPassengerDTO getPrimaryPassenger() {
        return primaryPassenger;
    }

    public void setPrimaryPassenger(PrimaryPassengerDTO primaryPassenger) {
        this.primaryPassenger = primaryPassenger;
    }

    public List<AdditionalPassengerDTO> getAdditionalPassengers() {
        return additionalPassengers;
    }

    public void setAdditionalPassengers(List<AdditionalPassengerDTO> additionalPassengers) {
        this.additionalPassengers = additionalPassengers;
    }
}