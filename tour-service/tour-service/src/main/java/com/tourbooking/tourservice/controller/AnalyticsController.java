// src/main/java/com/tourbooking/tourservice/controller/AnalyticsController.java
package com.tourbooking.tourservice.controller;

import com.tourbooking.tourservice.dto.AnalyticsResponse;
import com.tourbooking.tourservice.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    /**
     * Get complete analytics data
     * @param period - "daily", "monthly", or "yearly" (default: monthly)
     */
    @GetMapping
    public ResponseEntity<AnalyticsResponse> getAnalytics(
            @RequestParam(defaultValue = "monthly") String period
    ) {
        try {
            AnalyticsResponse analytics = analyticsService.getAnalytics(period);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}