package com.tourbooking.tourservice.config;

import com.tourbooking.tourservice.model.User;
import com.tourbooking.tourservice.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collections;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;



    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Request header se Authorization header nikalna
        String authorizationHeader = request.getHeader("Authorization");

        String email = null;
        String jwt = null;

        // Token extract karna
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // "Bearer " remove kar ke token nikalo

            try {
                email = jwtUtil.extractUsername(jwt); // Token se email nikalo
            } catch (Exception e) {
                // Invalid token
                System.out.println("Invalid JWT Token");
            }
        }

        // Agar email mila aur user authenticated nahi hai
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // ✅ NO DB QUERY - Token validation is enough!
            if (jwtUtil.validateToken(jwt, email)) {
                String role = jwtUtil.extractRole(jwt);

                // ✅ Validate role
                if (role != null && (role.equals("USER") || role.equals("ADMIN"))) {
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

                    // ✅ Use email as principal instead of User object
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(email, null, Collections.singletonList(authority));

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        // Next filter ko call karo
        filterChain.doFilter(request, response);
    }
}