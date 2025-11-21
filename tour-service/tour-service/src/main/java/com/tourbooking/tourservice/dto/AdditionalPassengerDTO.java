package com.tourbooking.tourservice.dto;

import jakarta.validation.constraints.*;

public class AdditionalPassengerDTO {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2-100 characters")
    private String name;

    @NotNull(message = "Age is required")
    @Min(value = 1, message = "Age must be at least 1")
    @Max(value = 120, message = "Age must be less than 120")
    private Integer age;

    private String gender;

    // ✅ ID Proof OPTIONAL for additional passengers
    private String idProof;

    // Constructors
    public AdditionalPassengerDTO() {
    }

    public AdditionalPassengerDTO(String name, Integer age, String gender, String idProof) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.idProof = idProof;
    }

    // Getters & Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getIdProof() {
        return idProof;
    }

    public void setIdProof(String idProof) {
        this.idProof = idProof;
    }
}