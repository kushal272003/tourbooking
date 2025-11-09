package com.tourbooking.tourservice.repository;

import com.tourbooking.tourservice.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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


    // Duration range se filter (e.g., 1-3 days, 3-7 days)
    List<Tour> findByDurationBetween(Integer minDuration, Integer maxDuration);


    // Date range se filter (start date aur end date ke beech)
    @Query("SELECT t FROM Tour t WHERE t.startDate BETWEEN :startDate AND :endDate")
    List<Tour> findByDateRange(@Param("startDate") LocalDate startDate,
                               @Param("endDate") LocalDate endDate);


    // Advanced Search - Multiple filters combined
    @Query("SELECT t FROM Tour t WHERE " +
            "(:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(t.destination) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:minPrice IS NULL OR t.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR t.price <= :maxPrice) " +
            "AND (:minDuration IS NULL OR t.duration >= :minDuration) " +
            "AND (:maxDuration IS NULL OR t.duration <= :maxDuration) " +
            "AND (:startDate IS NULL OR t.startDate >= :startDate) " +
            "AND (:endDate IS NULL OR t.startDate <= :endDate) " +
            "AND (:availableOnly = false OR t.availableSeats > 0)")
    List<Tour> findByAdvancedFilters(
            @Param("keyword") String keyword,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("minDuration") Integer minDuration,
            @Param("maxDuration") Integer maxDuration,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("availableOnly") Boolean availableOnly
    );

    // Sort by price (ascending/descending)
    List<Tour> findAllByOrderByPriceAsc();
    List<Tour> findAllByOrderByPriceDesc();

    // Sort by duration
    List<Tour> findAllByOrderByDurationAsc();
    List<Tour> findAllByOrderByDurationDesc();

    // Sort by start date
    List<Tour> findAllByOrderByStartDateAsc();
    List<Tour> findAllByOrderByStartDateDesc();

    // Get all unique destinations (for filter dropdown)
    @Query("SELECT DISTINCT t.destination FROM Tour t ORDER BY t.destination")
    List<String> findAllUniqueDestinations();


    // Count tours by filters (for showing "X results found")
    @Query("SELECT COUNT(t) FROM Tour t WHERE " +
            "(:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(t.destination) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:minPrice IS NULL OR t.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR t.price <= :maxPrice) " +
            "AND (:minDuration IS NULL OR t.duration >= :minDuration) " +
            "AND (:maxDuration IS NULL OR t.duration <= :maxDuration) " +
            "AND (:startDate IS NULL OR t.startDate >= :startDate) " +
            "AND (:endDate IS NULL OR t.startDate <= :endDate) " +
            "AND (:availableOnly = false OR t.availableSeats > 0)")
    Long countByAdvancedFilters(
            @Param("keyword") String keyword,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("minDuration") Integer minDuration,
            @Param("maxDuration") Integer maxDuration,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("availableOnly") Boolean availableOnly
    );





    List<Tour> findByCategoryIgnoreCase(String category);
}