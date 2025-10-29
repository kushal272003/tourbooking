package com.tourbooking.tourservice.controller;

import com.tourbooking.tourservice.model.Tour;
import com.tourbooking.tourservice.service.FileStorageService;
import com.tourbooking.tourservice.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tours")
public class TourController {

    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private TourService tourService;

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
    public ResponseEntity<?> getTourById(@PathVariable Long id) {
        Tour tour = tourService.getTourById(id).orElse(null);
        if (tour != null) {
            return ResponseEntity.ok(tour);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tour not found");
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

    // Tour delete karna
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTour(@PathVariable Long id) {
        tourService.deleteTour(id);
        return new ResponseEntity<>("Tour deleted successfully", HttpStatus.OK);
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
            @RequestParam("image") MultipartFile image) {

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
}