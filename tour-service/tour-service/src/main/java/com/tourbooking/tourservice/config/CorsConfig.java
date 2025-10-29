package com.tourbooking.tourservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // React app ka URL
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));

        // All HTTP methods allow
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // All headers allow
        config.setAllowedHeaders(Arrays.asList("*"));

        // Expose headers
        config.setExposedHeaders(Arrays.asList("Authorization"));

        // Credentials allow (for cookies/auth)
        config.setAllowCredentials(true);

        // Max age for preflight cache (1 hour)
        config.setMaxAge(3600L);

        // Apply to all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}