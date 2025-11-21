// src/main/java/com/tourbooking/tourservice/dto/PassengerDTO.java
package com.tourbooking.tourservice.dto;

public class PassengerDTO {

    private String name;
    private String email;
    private String phone;
    private Integer age;
    private String idProof;

    // ✅ Default Constructor
    public PassengerDTO() {
    }

    // ✅ Parameterized Constructor
    public PassengerDTO(String name, String email, String phone, Integer age, String idProof) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.age = age;
        this.idProof = idProof;
    }

    // ✅ Getters & Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getIdProof() {
        return idProof;
    }

    public void setIdProof(String idProof) {
        this.idProof = idProof;
    }
}