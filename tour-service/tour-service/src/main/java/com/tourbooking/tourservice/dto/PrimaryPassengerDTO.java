package com.tourbooking.tourservice.dto;

import jakarta.validation.constraints.*;

public class PrimaryPassengerDTO {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2-100 characters")
    private String name;

    @NotNull(message = "Age is required")
    @Min(value = 1, message = "Age must be at least 1")
    @Max(value = 120, message = "Age must be less than 120")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "ID Proof is required for primary passenger")
    @Size(min = 6, max = 50, message = "ID proof must be valid")
    private String idProof; // Mandatory for primary passenger

    // Constructors
    public PrimaryPassengerDTO() {
    }

    public PrimaryPassengerDTO(String name, Integer age, String gender, String idProof) {
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