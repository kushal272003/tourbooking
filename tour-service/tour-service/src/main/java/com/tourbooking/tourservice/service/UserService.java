package com.tourbooking.tourservice.service;

import com.tourbooking.tourservice.model.User;
import com.tourbooking.tourservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.tourbooking.tourservice.exception.BadRequestException;
import com.tourbooking.tourservice.exception.ResourceNotFoundException;
import com.tourbooking.tourservice.model.Role;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException("Email already exists!");
        }

        // Password encrypt karna
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);

        return userRepository.save(user);
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ID se user find karna
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Email se user find karna
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // User delete karna
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // User update karna
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setName(userDetails.getName());
        user.setPhone(userDetails.getPhone());

        return userRepository.save(user);
    }
    // Admin user register karna (special method)
    public User registerAdmin(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException("Email already exists!");
        }

        // Password encrypt karna
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);

        // Role ADMIN set karna
        user.setRole(Role.ADMIN);

        return userRepository.save(user);
    }
}