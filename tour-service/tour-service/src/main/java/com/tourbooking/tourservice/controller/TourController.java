package com.tourbooking.tourservice.controller;

import com.tourbooking.tourservice.dto.ErrorResponse;
import com.tourbooking.tourservice.model.Tour;
import com.tourbooking.tourservice.repository.TourRepository;
import com.tourbooking.tourservice.service.FileStorageService;
import com.tourbooking.tourservice.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tours")
public class TourController {




    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private TourService tourService;
    @Autowired
    private TourRepository tourRepository;

    // Naya tour create karna
    @PostMapping
    public ResponseEntity<?> createTour(@Valid @RequestBody Tour tour) {
        try {
            Tour createdTour = tourService.createTour(tour);
            return new ResponseEntity<>(createdTour, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Sabhi tours list
    @GetMapping
    public ResponseEntity<List<Tour>> getAllTours() {
        List<Tour> tours = tourService.getAllTours();
        return new ResponseEntity<>(tours, HttpStatus.OK);
    }

    // ID se tour find karna
    @GetMapping("/{id}")
    public ResponseEntity<Tour> getTourById(@PathVariable Long id) {
        Optional<Tour> tour = tourRepository.findById(id);
        return tour.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Destination se tours filter
    @GetMapping("/destination/{destination}")
    public ResponseEntity<List<Tour>> getToursByDestination(@PathVariable String destination) {
        List<Tour> tours = tourService.getToursByDestination(destination);
        return new ResponseEntity<>(tours, HttpStatus.OK);
    }

    // Price range se filter
    @GetMapping("/price-range")
    public ResponseEntity<List<Tour>> getToursByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice) {
        List<Tour> tours = tourService.getToursByPriceRange(minPrice, maxPrice);
        return new ResponseEntity<>(tours, HttpStatus.OK);
    }

    // Available tours (seats available hain)
    @GetMapping("/available")
    public ResponseEntity<List<Tour>> getAvailableTours() {
        List<Tour> tours = tourService.getAvailableTours();
        return new ResponseEntity<>(tours, HttpStatus.OK);
    }

    // Upcoming tours
    @GetMapping("/upcoming")
    public ResponseEntity<List<Tour>> getUpcomingTours() {
        List<Tour> tours = tourService.getUpcomingTours();
        return new ResponseEntity<>(tours, HttpStatus.OK);
    }

    // Title se search
    @GetMapping("/search")
    public ResponseEntity<List<Tour>> searchTours(@RequestParam String keyword) {
        List<Tour> tours = tourService.searchToursByTitle(keyword);
        return new ResponseEntity<>(tours, HttpStatus.OK);
    }

    // Tour update karna
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTour(@PathVariable Long id,@Valid @RequestBody Tour tour) {
        try {
            Tour updatedTour = tourService.updateTour(id, tour);
            return new ResponseEntity<>(updatedTour, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTour(@PathVariable Long id) {
        tourService.deleteTour(id);
        return ResponseEntity.ok(Map.of("message", "Tour and related records deleted successfully"));
    }


    // Seat book karna
    @PostMapping("/{id}/book-seat")
    public ResponseEntity<?> bookSeat(@PathVariable Long id) {
        try {
            Tour tour = tourService.bookSeat(id);
            return new ResponseEntity<>(tour, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    // Tour create with image upload
    @PostMapping("/with-image")
    public ResponseEntity<?> createTourWithImage(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("destination") String destination,
            @RequestParam("price") Double price,
            @RequestParam("duration") Integer duration,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("availableSeats") Integer availableSeats,
            @RequestParam("totalSeats") Integer totalSeats,
            @RequestParam("image") MultipartFile image,
            @RequestParam(required = false) List<String> itinerary,
            @RequestParam(required = false) List<String> inclusions,
            @RequestParam(required = false) List<String> exclusions
            ) {

        try {
            // Image upload
            String imageUrl = fileStorageService.storeFile(image);

            // Tour object create
            Tour tour = new Tour();
            tour.setTitle(title);
            tour.setDescription(description);
            tour.setDestination(destination);
            tour.setPrice(price);
            tour.setDuration(duration);
            tour.setStartDate(LocalDate.parse(startDate));
            tour.setEndDate(LocalDate.parse(endDate));
            tour.setAvailableSeats(availableSeats);
            tour.setTotalSeats(totalSeats);
            tour.setImageUrl(imageUrl);

            // Save tour
            Tour createdTour = tourService.createTour(tour);
            return new ResponseEntity<>(createdTour, HttpStatus.CREATED);

        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/advanced-search")
    public ResponseEntity<Map<String, Object>> advancedSearch(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer minDuration,
            @RequestParam(required = false) Integer maxDuration,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Boolean availableOnly,
            @RequestParam(required = false) String sortBy) {

        try {
            // Get filtered tours
            List<Tour> tours = tourService.searchToursWithAdvancedFilters(
                    keyword,
                    minPrice,
                    maxPrice,
                    minDuration,
                    maxDuration,
                    startDate,
                    endDate,
                    availableOnly,
                    sortBy
            );

            // Get count
            Long count = tourService.getFilteredToursCount(
                    keyword,
                    minPrice,
                    maxPrice,
                    minDuration,
                    maxDuration,
                    startDate,
                    endDate,
                    availableOnly
            );

            // Response object
            Map<String, Object> response = new HashMap<>();
            response.put("tours", tours);
            response.put("totalResults", count);
            response.put("filtersApplied", buildFiltersAppliedMap(
                    keyword, minPrice, maxPrice, minDuration, maxDuration,
                    startDate, endDate, availableOnly, sortBy
            ));

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get price range (min and max) for slider
     * Endpoint: GET /api/tours/price-range-data
     */
    @GetMapping("/price-range-data")
    public ResponseEntity<Map<String, Double>> getPriceRangeData() {
        TourService.PriceRange priceRange = tourService.getPriceRange();

        Map<String, Double> response = new HashMap<>();
        response.put("minPrice", priceRange.getMinPrice());
        response.put("maxPrice", priceRange.getMaxPrice());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Get all unique destinations for filter dropdown
     * Endpoint: GET /api/tours/destinations
     */
    @GetMapping("/destinations")
    public ResponseEntity<List<String>> getAllDestinations() {
        List<String> destinations = tourService.getAllDestinations();
        return new ResponseEntity<>(destinations, HttpStatus.OK);
    }

    /**
     * Get tours by duration range
     * Endpoint: GET /api/tours/duration-range
     */
    @GetMapping("/duration-range")
    public ResponseEntity<List<Tour>> getToursByDurationRange(
            @RequestParam Integer minDuration,
            @RequestParam Integer maxDuration) {
        List<Tour> tours = tourService.getToursByDurationRange(minDuration, maxDuration);
        return new ResponseEntity<>(tours, HttpStatus.OK);
    }

    /**
     * Get tours by date range
     * Endpoint: GET /api/tours/date-range
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<Tour>> getToursByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Tour> tours = tourService.getToursByDateRange(startDate, endDate);
        return new ResponseEntity<>(tours, HttpStatus.OK);
    }

    /**
     * Helper method to build filters applied map
     */
    private Map<String, Object> buildFiltersAppliedMap(
            String keyword, Double minPrice, Double maxPrice,
            Integer minDuration, Integer maxDuration,
            LocalDate startDate, LocalDate endDate,
            Boolean availableOnly, String sortBy) {

        Map<String, Object> filters = new HashMap<>();

        if (keyword != null && !keyword.isEmpty()) {
            filters.put("keyword", keyword);
        }
        if (minPrice != null) {
            filters.put("minPrice", minPrice);
        }
        if (maxPrice != null) {
            filters.put("maxPrice", maxPrice);
        }
        if (minDuration != null) {
            filters.put("minDuration", minDuration);
        }
        if (maxDuration != null) {
            filters.put("maxDuration", maxDuration);
        }
        if (startDate != null) {
            filters.put("startDate", startDate);
        }
        if (endDate != null) {
            filters.put("endDate", endDate);
        }
        if (availableOnly != null && availableOnly) {
            filters.put("availableOnly", true);
        }
        if (sortBy != null && !sortBy.isEmpty()) {
            filters.put("sortBy", sortBy);
        }

        return filters;
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Tour>> getToursByCategory(@PathVariable String category) {
        List<Tour> tours = tourRepository.findByCategoryIgnoreCase(category);
        if (tours.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(tours);
    }



}