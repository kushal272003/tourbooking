package com.tourbooking.tourservice.repository;

import com.tourbooking.tourservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Email se user find karna
    Optional<User> findByEmail(String email);

    // Email exist karta hai ya nahi check karna
    boolean existsByEmail(String email);
}