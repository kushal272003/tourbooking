package com.tourbooking.tourservice.controller;

import com.tourbooking.tourservice.config.JwtUtil;
import com.tourbooking.tourservice.dto.DTOMapper;
import com.tourbooking.tourservice.dto.LoginRequest;
import com.tourbooking.tourservice.dto.UserDTO;
import com.tourbooking.tourservice.exception.BadRequestException;
import com.tourbooking.tourservice.model.User;
import com.tourbooking.tourservice.repository.UserRepository;
import com.tourbooking.tourservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.tourbooking.tourservice.exception.ResourceNotFoundException;
import com.tourbooking.tourservice.exception.UnauthorizedException;
import com.tourbooking.tourservice.dto.LoginResponse;

import jakarta.validation.Valid;
import java.util.Map;
import com.tourbooking.tourservice.exception.UnauthorizedException;
import com.tourbooking.tourservice.exception.BadRequestException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // User register karna
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            UserDTO userDTO = DTOMapper.toUserDTO(registeredUser);
            return new ResponseEntity<>(userDTO, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        User user = userService.getUserByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + loginRequest.getEmail()));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid password");
        }

        // Token me role bhi add kar rahe
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());

        UserDTO userDTO = DTOMapper.toUserDTO(user);
        LoginResponse response = new LoginResponse(token, userDTO);

        return ResponseEntity.ok(response);
    }
    // Sabhi users ki list
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTOs = users.stream()
                .map(DTOMapper::toUserDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(userDTOs, HttpStatus.OK);
    }

    // ID se user find karna
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id).orElse(null);
        if (user != null) {
            UserDTO userDTO = DTOMapper.toUserDTO(user);
            return ResponseEntity.ok(userDTO);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    // Email se user find karna
    @GetMapping("/search/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email).orElse(null);
        if (user != null) {
            UserDTO userDTO = DTOMapper.toUserDTO(user);
            return ResponseEntity.ok(userDTO);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    // User delete karna
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
    }

    // User update karna
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@Valid @PathVariable Long id, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(id, user);
            UserDTO userDTO = DTOMapper.toUserDTO(updatedUser);
            return new ResponseEntity<>(userDTO, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    // Admin register karna (temporary endpoint - production me hata dena)


    // Get user profile
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        User user = userService.getUserById(id).orElse(null);
        if (user != null) {
            UserDTO userDTO = DTOMapper.toUserDTO(user);
            return ResponseEntity.ok(userDTO);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    // Update user profile
    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        try {
            User user = userService.getUserById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

            // Update name
            if (updates.containsKey("name")) {
                user.setName(updates.get("name"));
            }

            // Update phone
            if (updates.containsKey("phone")) {
                user.setPhone(updates.get("phone"));
            }

            User updatedUser = userRepository.save(user);
            UserDTO userDTO = DTOMapper.toUserDTO(updatedUser);
            return ResponseEntity.ok(userDTO);

        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Change password
    @PutMapping("/change-password/{id}")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> passwordData) {
        try {
            User user = userService.getUserById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");

            // Verify current password
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                throw new UnauthorizedException("Current password is incorrect!");
            }

            // Validate new password
            if (newPassword == null || newPassword.length() < 6) {
                throw new BadRequestException("New password must be at least 6 characters long!");
            }

            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            return ResponseEntity.ok("Password changed successfully!");

        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}