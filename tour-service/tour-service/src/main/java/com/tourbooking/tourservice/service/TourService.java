package com.tourbooking.tourservice.service;

import com.tourbooking.tourservice.model.BookingStatus;
import com.tourbooking.tourservice.model.Tour;
import com.tourbooking.tourservice.repository.BookingRepository;
import com.tourbooking.tourservice.repository.TourRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.tourbooking.tourservice.exception.BadRequestException;
import com.tourbooking.tourservice.exception.ResourceNotFoundException;

@Service
public class TourService {

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // Naya tour create karna
    public Tour createTour(Tour tour) {

        if (tour.getStartDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Start date must be in the future!");
        }

        if (tour.getAvailableSeats() > tour.getTotalSeats()) {
            throw new BadRequestException("Available seats cannot be greater than total seats!");
        }

        if (tour.getEndDate().isBefore(tour.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date!");
        }
        if (tour.getItinerary() == null) tour.setItinerary(List.of());
        if (tour.getInclusions() == null) tour.setInclusions(List.of());
        if (tour.getExclusions() == null) tour.setExclusions(List.of());
        return tourRepository.save(tour);
    }

    // Sabhi tours list
    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    // ID se tour find karna
    public Optional<Tour> getTourById(Long id) {
        return tourRepository.findById(id);
    }

    // Destination se tours find karna
    public List<Tour> getToursByDestination(String destination) {
        return tourRepository.findByDestination(destination);
    }

    // Price range me tours
    public List<Tour> getToursByPriceRange(Double minPrice, Double maxPrice) {
        return tourRepository.findByPriceBetween(minPrice, maxPrice);
    }

    // Available tours (jahan seats available hain)
    public List<Tour> getAvailableTours() {
        return tourRepository.findByAvailableSeatsGreaterThan(0);
    }

    // Upcoming tours (aane wale tours)
    public List<Tour> getUpcomingTours() {
        return tourRepository.findByStartDateAfter(LocalDate.now());
    }

    // Title se search
    public List<Tour> searchToursByTitle(String keyword) {
        return tourRepository.findByTitleContainingIgnoreCase(keyword);
    }

    // Tour update karna
    public Tour updateTour(Long id, Tour tourDetails) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + id));

        tour.setTitle(tourDetails.getTitle());
        tour.setDescription(tourDetails.getDescription());
        tour.setDestination(tourDetails.getDestination());
        tour.setPrice(tourDetails.getPrice());
        tour.setDuration(tourDetails.getDuration());
        tour.setStartDate(tourDetails.getStartDate());
        tour.setEndDate(tourDetails.getEndDate());
        tour.setAvailableSeats(tourDetails.getAvailableSeats());
        tour.setTotalSeats(tourDetails.getTotalSeats());
        tour.setImageUrl(tourDetails.getImageUrl());
        tour.setImageUrl2(tourDetails.getImageUrl2());  // ✅ CORRECT
        tour.setImageUrl3(tourDetails.getImageUrl3());  // ✅ CORRECT
        tour.setItinerary(tourDetails.getItinerary());
        tour.setInclusions(tourDetails.getInclusions());
        tour.setExclusions(tourDetails.getExclusions());

        return tourRepository.save(tour);
    }

    // Tour delete karna

    @Transactional
    public void deleteTour(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + id));

        // ✅ Check for active bookings
        long confirmedBookings = bookingRepository.findByTourIdAndStatus(id, BookingStatus.CONFIRMED).size();
        if (confirmedBookings > 0) {
            throw new BadRequestException(
                    "Cannot delete tour with " + confirmedBookings + " confirmed bookings! Cancel bookings first."
            );
        }

        long pendingBookings = bookingRepository.findByTourIdAndStatus(id, BookingStatus.PENDING).size();
        if (pendingBookings > 0) {
            throw new BadRequestException(
                    "Cannot delete tour with " + pendingBookings + " pending bookings!"
            );
        }

        tourRepository.delete(tour);
    }

    public Tour bookSeat(Long tourId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        if (tour.getAvailableSeats() <= 0) {
            throw new BadRequestException("No seats available!");
        }

        tour.setAvailableSeats(tour.getAvailableSeats() - 1);
        return tourRepository.save(tour);
    }

    public List<Tour> searchToursWithAdvancedFilters(
            String keyword,
            Double minPrice,
            Double maxPrice,
            Integer minDuration,
            Integer maxDuration,
            LocalDate startDate,
            LocalDate endDate,
            Boolean availableOnly,
            String sortBy) {

        // Get filtered tours from repository
        List<Tour> tours = tourRepository.findByAdvancedFilters(
                keyword,
                minPrice,
                maxPrice,
                minDuration,
                maxDuration,
                startDate,
                endDate,
                availableOnly != null ? availableOnly : false
        );

        // Apply sorting
        if (sortBy != null && !sortBy.isEmpty()) {
            tours = applySorting(tours, sortBy);
        }

        return tours;
    }
    private List<Tour> applySorting(List<Tour> tours, String sortBy) {
        switch (sortBy.toLowerCase()) {
            case "price_asc":
                return tours.stream()
                        .sorted(Comparator.comparing(Tour::getPrice))
                        .collect(Collectors.toList());

            case "price_desc":
                return tours.stream()
                        .sorted(Comparator.comparing(Tour::getPrice).reversed())
                        .collect(Collectors.toList());

            case "duration_asc":
                return tours.stream()
                        .sorted(Comparator.comparing(Tour::getDuration))
                        .collect(Collectors.toList());

            case "duration_desc":
                return tours.stream()
                        .sorted(Comparator.comparing(Tour::getDuration).reversed())
                        .collect(Collectors.toList());

            case "date_asc":
                return tours.stream()
                        .sorted(Comparator.comparing(Tour::getStartDate))
                        .collect(Collectors.toList());

            case "date_desc":
                return tours.stream()
                        .sorted(Comparator.comparing(Tour::getStartDate).reversed())
                        .collect(Collectors.toList());

            // Rating sort - requires review integration (implement later)
            case "rating":
                // TODO: Implement after review system integration
                return tours;

            default:
                return tours;
        }
    }

    /**
     * Get count of filtered results
     */
    public Long getFilteredToursCount(
            String keyword,
            Double minPrice,
            Double maxPrice,
            Integer minDuration,
            Integer maxDuration,
            LocalDate startDate,
            LocalDate endDate,
            Boolean availableOnly) {

        return tourRepository.countByAdvancedFilters(
                keyword,
                minPrice,
                maxPrice,
                minDuration,
                maxDuration,
                startDate,
                endDate,
                availableOnly != null ? availableOnly : false
        );
    }

    /**
     * Get all unique destinations for filter dropdown
     */
    public List<String> getAllDestinations() {
        return tourRepository.findAllUniqueDestinations();
    }

    /**
     * Get tours by duration range
     */
    public List<Tour> getToursByDurationRange(Integer minDuration, Integer maxDuration) {
        return tourRepository.findByDurationBetween(minDuration, maxDuration);
    }

    /**
     * Get tours by date range
     */
    public List<Tour> getToursByDateRange(LocalDate startDate, LocalDate endDate) {
        return tourRepository.findByDateRange(startDate, endDate);
    }

    /**
     * Get min and max price for price range slider
     */
    public PriceRange getPriceRange() {
        List<Tour> tours = tourRepository.findAll();

        if (tours.isEmpty()) {
            return new PriceRange(0.0, 100000.0);
        }

        Double minPrice = tours.stream()
                .map(Tour::getPrice)
                .min(Double::compare)
                .orElse(0.0);

        Double maxPrice = tours.stream()
                .map(Tour::getPrice)
                .max(Double::compare)
                .orElse(100000.0);

        return new PriceRange(minPrice, maxPrice);
    }

    /**
     * Inner class for price range
     */
    public static class PriceRange {
        private Double minPrice;
        private Double maxPrice;

        public PriceRange(Double minPrice, Double maxPrice) {
            this.minPrice = minPrice;
            this.maxPrice = maxPrice;
        }

        public Double getMinPrice() {
            return minPrice;
        }

        public Double getMaxPrice() {
            return maxPrice;
        }
} }