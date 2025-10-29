package com.tourbooking.tourservice.service;

import com.tourbooking.tourservice.model.Tour;
import com.tourbooking.tourservice.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import com.tourbooking.tourservice.exception.BadRequestException;
import com.tourbooking.tourservice.exception.ResourceNotFoundException;

@Service
public class TourService {

    @Autowired
    private TourRepository tourRepository;

    // Naya tour create karna
    public Tour createTour(Tour tour) {
        if (tour.getAvailableSeats() > tour.getTotalSeats()) {
            throw new BadRequestException("Available seats cannot be greater than total seats!");
        }

        if (tour.getEndDate().isBefore(tour.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date!");
        }

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

        return tourRepository.save(tour);
    }

    // Tour delete karna
    public void deleteTour(Long id) {
        tourRepository.deleteById(id);
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
}