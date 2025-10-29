package com.tourbooking.tourservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


public class LoginResponse {

    private String token;
    private UserDTO user;
    private String message;

    public LoginResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
        this.message = "Login successful";
    }

    public LoginResponse() {
    }

    public LoginResponse(String token, UserDTO user, String message) {
        this.token = token;
        this.user = user;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}