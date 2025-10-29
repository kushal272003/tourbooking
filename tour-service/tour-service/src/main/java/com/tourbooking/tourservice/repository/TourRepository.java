package com.tourbooking.tourservice.repository;

import com.tourbooking.tourservice.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {

    // Destination se tours find karna
    List<Tour> findByDestination(String destination);

    // Price range me tours find karna
    List<Tour> findByPriceBetween(Double minPrice, Double maxPrice);

    // Available seats > 0 wale tours
    List<Tour> findByAvailableSeatsGreaterThan(Integer seats);

    // Specific date ke baad wale tours
    List<Tour> findByStartDateAfter(LocalDate date);

    // Title me keyword search (case-insensitive)
    List<Tour> findByTitleContainingIgnoreCase(String keyword);

    // Destination aur price range dono se filter
    List<Tour> findByDestinationAndPriceLessThanEqual(String destination, Double maxPrice);
}