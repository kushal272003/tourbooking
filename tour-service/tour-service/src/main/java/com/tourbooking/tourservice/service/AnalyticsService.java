// src/main/java/com/tourbooking/tourservice/service/AnalyticsService.java
package com.tourbooking.tourservice.service;

import com.tourbooking.tourservice.dto.*;
import com.tourbooking.tourservice.model.Booking;
import com.tourbooking.tourservice.model.BookingStatus;
import com.tourbooking.tourservice.model.Payment;
import com.tourbooking.tourservice.model.User;
import com.tourbooking.tourservice.repository.BookingRepository;
import com.tourbooking.tourservice.repository.PaymentRepository;
import com.tourbooking.tourservice.repository.TourRepository;
import com.tourbooking.tourservice.repository.UserRepository;
import com.tourbooking.tourservice.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    // ✅ Get Complete Analytics Data
    public AnalyticsResponse getAnalytics(String period) {
        AnalyticsResponse response = new AnalyticsResponse();

        // Quick Stats
        response.setTotalRevenue(getTotalRevenue());
        response.setTotalBookings((int) bookingRepository.count());
        response.setTotalUsers((int) userRepository.count());
        response.setActiveTours(getActiveToursCount());

        // Revenue Data
        response.setRevenueData(getRevenueData(period));

        // Popular Destinations
        response.setPopularDestinations(getPopularDestinations());

        // Top Rated Tours
        response.setTopRatedTours(getTopRatedTours());

        // User Growth
        response.setUserGrowth(getUserGrowthData());

        // Payment Stats
        response.setPaymentStats(getPaymentStats());

        // Booking Trends
        response.setBookingTrends(getBookingTrends());

        return response;
    }

    // ✅ Revenue Data (Last 7 days, 12 months, or years)
    private List<RevenueData> getRevenueData(String period) {
        List<Booking> bookings = bookingRepository.findAll();
        List<RevenueData> revenueList = new ArrayList<>();

        if ("daily".equalsIgnoreCase(period)) {
            // Last 7 days
            LocalDateTime now = LocalDateTime.now();
            for (int i = 6; i >= 0; i--) {
                LocalDateTime date = now.minusDays(i);
                String dateStr = date.format(DateTimeFormatter.ofPattern("dd MMM"));

                List<Booking> dayBookings = bookings.stream()
                        .filter(b -> b.getBookingDate().toLocalDate().equals(date.toLocalDate()))
                        .filter(b -> b.getStatus() != BookingStatus.CANCELLED)
                        .collect(Collectors.toList());

                double revenue = dayBookings.stream().mapToDouble(Booking::getTotalPrice).sum();
                revenueList.add(new RevenueData(dateStr, revenue, dayBookings.size()));
            }
        } else if ("monthly".equalsIgnoreCase(period)) {
            // Last 12 months
            LocalDateTime now = LocalDateTime.now();
            for (int i = 11; i >= 0; i--) {
                LocalDateTime month = now.minusMonths(i);
                String monthStr = month.format(DateTimeFormatter.ofPattern("MMM yyyy"));

                List<Booking> monthBookings = bookings.stream()
                        .filter(b -> b.getBookingDate().getYear() == month.getYear())
                        .filter(b -> b.getBookingDate().getMonthValue() == month.getMonthValue())
                        .filter(b -> b.getStatus() != BookingStatus.CANCELLED)
                        .collect(Collectors.toList());

                double revenue = monthBookings.stream().mapToDouble(Booking::getTotalPrice).sum();
                revenueList.add(new RevenueData(monthStr, revenue, monthBookings.size()));
            }
        } else {
            // Yearly (last 3 years)
            LocalDateTime now = LocalDateTime.now();
            for (int i = 2; i >= 0; i--) {
                int year = now.getYear() - i;

                List<Booking> yearBookings = bookings.stream()
                        .filter(b -> b.getBookingDate().getYear() == year)
                        .filter(b -> b.getStatus() != BookingStatus.CANCELLED)
                        .collect(Collectors.toList());

                double revenue = yearBookings.stream().mapToDouble(Booking::getTotalPrice).sum();
                revenueList.add(new RevenueData(String.valueOf(year), revenue, yearBookings.size()));
            }
        }

        return revenueList;
    }

    // ✅ Popular Destinations (Top 5)
    private List<DestinationStats> getPopularDestinations() {
        List<Booking> bookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED)
                .collect(Collectors.toList());

        Map<String, DestinationStats> destMap = new HashMap<>();

        for (Booking booking : bookings) {
            String destination = booking.getTour().getDestination();

            if (!destMap.containsKey(destination)) {
                destMap.put(destination, new DestinationStats(destination, 0, 0.0));
            }

            DestinationStats stats = destMap.get(destination);
            stats.setBookingCount(stats.getBookingCount() + 1);
            stats.setRevenue(stats.getRevenue() + booking.getTotalPrice());
        }

        return destMap.values().stream()
                .sorted((a, b) -> b.getBookingCount().compareTo(a.getBookingCount()))
                .limit(5)
                .collect(Collectors.toList());
    }

    // ✅ Top Rated Tours (Top 5)
    private List<TourRatingStats> getTopRatedTours() {
        return tourRepository.findAll().stream()
                .map(tour -> {
                    double avgRating = reviewRepository.findByTourId(tour.getId())
                            .stream()
                            .mapToInt(r -> r.getRating())
                            .average()
                            .orElse(0.0);

                    int reviewCount = reviewRepository.findByTourId(tour.getId()).size();
                    int bookingCount = (int) bookingRepository.findByTourId(tour.getId()).stream()
                            .filter(b -> b.getStatus() != BookingStatus.CANCELLED)
                            .count();

                    return new TourRatingStats(
                            tour.getId(),
                            tour.getTitle(),
                            avgRating,
                            reviewCount,
                            bookingCount
                    );
                })
                .filter(stats -> stats.getTotalReviews() > 0) // Only tours with reviews
                .sorted((a, b) -> Double.compare(b.getAverageRating(), a.getAverageRating()))
                .limit(5)
                .collect(Collectors.toList());
    }

    // ✅ User Growth Data (Last 12 months)
    private List<UserGrowthData> getUserGrowthData() {
        List<User> allUsers = userRepository.findAll();
        List<UserGrowthData> growthList = new ArrayList<>();

        LocalDateTime now = LocalDateTime.now();
        int totalUsers = 0;

        for (int i = 11; i >= 0; i--) {
            LocalDateTime month = now.minusMonths(i);
            String monthStr = month.format(DateTimeFormatter.ofPattern("MMM yyyy"));

            int newUsers = (int) allUsers.stream()
                    .filter(u -> u.getCreatedAt() != null)
                    .filter(u -> u.getCreatedAt().getYear() == month.getYear())
                    .filter(u -> u.getCreatedAt().getMonthValue() == month.getMonthValue())
                    .count();

            totalUsers += newUsers;
            growthList.add(new UserGrowthData(monthStr, newUsers, totalUsers));
        }

        return growthList;
    }

    // ✅ Payment Stats
    private PaymentStats getPaymentStats() {
        List<Payment> payments = paymentRepository.findAll();

        int total = payments.size();
        int successful = (int) payments.stream()
                .filter(p -> "SUCCESS".equalsIgnoreCase(p.getStatus()))
                .count();
        int failed = total - successful;

        double successRate = total > 0 ? (successful * 100.0 / total) : 0;

        double totalRevenue = payments.stream()
                .filter(p -> "SUCCESS".equalsIgnoreCase(p.getStatus()))
                .mapToDouble(Payment::getAmount)
                .sum();

        return new PaymentStats(total, successful, failed, successRate, totalRevenue);
    }

    // ✅ Booking Trends
    private BookingTrendsData getBookingTrends() {
        List<Booking> bookings = bookingRepository.findAll();
        BookingTrendsData trends = new BookingTrendsData();

        // Status counts
        int confirmed = (int) bookings.stream().filter(b -> b.getStatus() == BookingStatus.CONFIRMED).count();
        int pending = (int) bookings.stream().filter(b -> b.getStatus() == BookingStatus.PENDING).count();
        int cancelled = (int) bookings.stream().filter(b -> b.getStatus() == BookingStatus.CANCELLED).count();

        trends.setConfirmedCount(confirmed);
        trends.setPendingCount(pending);
        trends.setCancelledCount(cancelled);

        // Monthly data (last 6 months)
        List<MonthlyBookingData> monthlyData = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (int i = 5; i >= 0; i--) {
            LocalDateTime month = now.minusMonths(i);
            String monthStr = month.format(DateTimeFormatter.ofPattern("MMM yyyy"));

            int monthConfirmed = (int) bookings.stream()
                    .filter(b -> b.getBookingDate().getYear() == month.getYear())
                    .filter(b -> b.getBookingDate().getMonthValue() == month.getMonthValue())
                    .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                    .count();

            int monthPending = (int) bookings.stream()
                    .filter(b -> b.getBookingDate().getYear() == month.getYear())
                    .filter(b -> b.getBookingDate().getMonthValue() == month.getMonthValue())
                    .filter(b -> b.getStatus() == BookingStatus.PENDING)
                    .count();

            int monthCancelled = (int) bookings.stream()
                    .filter(b -> b.getBookingDate().getYear() == month.getYear())
                    .filter(b -> b.getBookingDate().getMonthValue() == month.getMonthValue())
                    .filter(b -> b.getStatus() == BookingStatus.CANCELLED)
                    .count();

            monthlyData.add(new MonthlyBookingData(monthStr, monthConfirmed, monthPending, monthCancelled));
        }

        trends.setMonthlyData(monthlyData);
        return trends;
    }

    // Helper methods
    private Double getTotalRevenue() {
        return bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED)
                .mapToDouble(Booking::getTotalPrice)
                .sum();
    }

    private Integer getActiveToursCount() {
        return (int) tourRepository.findAll().stream()
                .filter(t -> t.getAvailableSeats() > 0)
                .count();
    }
}