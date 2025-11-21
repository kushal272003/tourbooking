// src/pages/PassengerInformation.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../assets/PassengerInformation.css";

const PassengerInformation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ✅ Contact Details (Common for all)
  const [contactDetails, setContactDetails] = useState({
    email: "",
    phone: "",
  });

  // ✅ Primary Passenger
  const [primaryPassenger, setPrimaryPassenger] = useState({
    name: "",
    age: "",
    gender: "",
    idProof: "",
  });

  // ✅ Additional Passengers
  const [additionalPassengers, setAdditionalPassengers] = useState([]);

  const [errors, setErrors] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize passengers based on seat count
  useEffect(() => {
    if (!state || !state.tour) {
      navigate("/tours");
      return;
    }

    // Initialize additional passengers (numberOfSeats - 1)
    const additionalCount = state.numberOfSeats - 1;
    const initialAdditional = Array.from({ length: additionalCount }, () => ({
      name: "",
      age: "",
      gender: "",
      idProof: "", // Optional
    }));

    setAdditionalPassengers(initialAdditional);
    setIsInitialized(true);
  }, [state, navigate]);

  // Early return after all hooks
  if (!state || !state.tour || !isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem' 
      }}>
        Loading...
      </div>
    );
  }

  const { tour, numberOfSeats, totalPrice } = state;

  // ✅ Handle Contact Details Change
  const handleContactChange = (field, value) => {
    setContactDetails({
      ...contactDetails,
      [field]: value,
    });

    // Clear error
    if (errors[`contact-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`contact-${field}`];
      setErrors(newErrors);
    }
  };

  // ✅ Handle Primary Passenger Change
  const handlePrimaryChange = (field, value) => {
    setPrimaryPassenger({
      ...primaryPassenger,
      [field]: value,
    });

    // Clear error
    if (errors[`primary-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`primary-${field}`];
      setErrors(newErrors);
    }
  };

  // ✅ Handle Additional Passenger Change
  const handleAdditionalChange = (index, field, value) => {
    const updated = [...additionalPassengers];
    updated[index][field] = value;
    setAdditionalPassengers(updated);

    // Clear error
    if (errors[`additional-${index}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`additional-${index}-${field}`];
      setErrors(newErrors);
    }
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};

    // Contact Details Validation
    if (!contactDetails.email.trim()) {
      newErrors["contact-email"] = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(contactDetails.email)) {
      newErrors["contact-email"] = "Invalid email format";
    }

    if (!contactDetails.phone.trim()) {
      newErrors["contact-phone"] = "Phone is required";
    } else if (!/^[6-9]\d{9}$/.test(contactDetails.phone)) {
      newErrors["contact-phone"] = "Invalid phone number (10 digits)";
    }

    // Primary Passenger Validation
    if (!primaryPassenger.name.trim()) {
      newErrors["primary-name"] = "Name is required";
    } else if (primaryPassenger.name.trim().length < 3) {
      newErrors["primary-name"] = "Name must be at least 3 characters";
    }

    if (!primaryPassenger.age) {
      newErrors["primary-age"] = "Age is required";
    } else if (primaryPassenger.age < 1 || primaryPassenger.age > 120) {
      newErrors["primary-age"] = "Invalid age";
    }

    if (!primaryPassenger.gender) {
      newErrors["primary-gender"] = "Gender is required";
    }

    if (!primaryPassenger.idProof.trim()) {
      newErrors["primary-idProof"] = "ID proof is required for primary passenger";
    } else if (primaryPassenger.idProof.trim().length < 6) {
      newErrors["primary-idProof"] = "ID proof must be valid (min 6 characters)";
    }

    // Additional Passengers Validation
    additionalPassengers.forEach((passenger, index) => {
      if (!passenger.name.trim()) {
        newErrors[`additional-${index}-name`] = "Name is required";
      } else if (passenger.name.trim().length < 3) {
        newErrors[`additional-${index}-name`] = "Name must be at least 3 characters";
      }

      if (!passenger.age) {
        newErrors[`additional-${index}-age`] = "Age is required";
      } else if (passenger.age < 1 || passenger.age > 120) {
        newErrors[`additional-${index}-age`] = "Invalid age";
      }

      // Gender and ID Proof are optional for additional passengers
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill all required details correctly");
      return;
    }

    // Navigate to confirmation with new structure
    navigate("/booking-confirm", {
      state: {
        tour,
        numberOfSeats,
        totalPrice,
        contactDetails,
        primaryPassenger,
        additionalPassengers,
      },
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="passenger-info-page">
      <div className="passenger-container">
        <button onClick={() => navigate(-1)} className="btn-back">
          <FaArrowLeft /> Back
        </button>

        <div className="page-header">
          <h1>Passenger Information</h1>
          <p>Please provide details for all {numberOfSeats} passenger{numberOfSeats > 1 ? 's' : ''}</p>
        </div>

        <div className="info-grid">
          {/* Left: Tour Summary */}
          <div className="tour-quick-summary">
            <img src={tour.imageUrl} alt={tour.title} />
            <h3>{tour.title}</h3>
            <div className="quick-details">
              <p>📍 {tour.destination}</p>
              <p>📅 {formatDate(tour.startDate)}</p>
              <p>🎫 {numberOfSeats} Seat{numberOfSeats > 1 ? 's' : ''}</p>
              <p className="price">💰 ₹{totalPrice.toLocaleString("en-IN")}</p>
            </div>
          </div>

          {/* Right: Passenger Forms */}
          <div className="passenger-forms">
            <form onSubmit={handleSubmit}>
              
              {/* ✅ CONTACT DETAILS (Common for All) */}
              <div className="contact-section">
                <h2>📧 Contact Details (For All Passengers)</h2>
                <p className="section-note">These details will be used for booking confirmation and communication</p>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <FaEnvelope /> Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={contactDetails.email}
                      onChange={(e) => handleContactChange("email", e.target.value)}
                      className={errors["contact-email"] ? "error" : ""}
                    />
                    {errors["contact-email"] && (
                      <span className="error-text">{errors["contact-email"]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>
                      <FaPhone /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={contactDetails.phone}
                      onChange={(e) => handleContactChange("phone", e.target.value)}
                      maxLength="10"
                      className={errors["contact-phone"] ? "error" : ""}
                    />
                    {errors["contact-phone"] && (
                      <span className="error-text">{errors["contact-phone"]}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* ✅ PRIMARY PASSENGER */}
              <div className="passenger-card primary-card">
                <h3>⭐ Primary Passenger (Main Contact)</h3>
                <p className="card-note">This person will be the main contact for the booking</p>

                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <FaUser /> Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={primaryPassenger.name}
                      onChange={(e) => handlePrimaryChange("name", e.target.value)}
                      className={errors["primary-name"] ? "error" : ""}
                    />
                    {errors["primary-name"] && (
                      <span className="error-text">{errors["primary-name"]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Age *</label>
                    <input
                      type="number"
                      placeholder="Age"
                      value={primaryPassenger.age}
                      onChange={(e) => handlePrimaryChange("age", e.target.value)}
                      min="1"
                      max="120"
                      className={errors["primary-age"] ? "error" : ""}
                    />
                    {errors["primary-age"] && (
                      <span className="error-text">{errors["primary-age"]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Gender *</label>
                    <select
                      value={primaryPassenger.gender}
                      onChange={(e) => handlePrimaryChange("gender", e.target.value)}
                      className={errors["primary-gender"] ? "error" : ""}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors["primary-gender"] && (
                      <span className="error-text">{errors["primary-gender"]}</span>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label>
                      <FaIdCard /> ID Proof Number (Aadhar/Passport/PAN) *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter ID proof number"
                      value={primaryPassenger.idProof}
                      onChange={(e) => handlePrimaryChange("idProof", e.target.value)}
                      className={errors["primary-idProof"] ? "error" : ""}
                    />
                    {errors["primary-idProof"] && (
                      <span className="error-text">{errors["primary-idProof"]}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* ✅ ADDITIONAL PASSENGERS */}
              {additionalPassengers.length > 0 && (
                <div className="additional-section">
                  <h2>👥 Additional Passengers</h2>
                  <p className="section-note">ID Proof is optional for additional passengers</p>

                  {additionalPassengers.map((passenger, index) => (
                    <div key={index} className="passenger-card additional-card">
                      <h3>Passenger {index + 2}</h3>

                      <div className="form-grid">
                        <div className="form-group">
                          <label>
                            <FaUser /> Full Name *
                          </label>
                          <input
                            type="text"
                            placeholder="Enter full name"
                            value={passenger.name}
                            onChange={(e) =>
                              handleAdditionalChange(index, "name", e.target.value)
                            }
                            className={errors[`additional-${index}-name`] ? "error" : ""}
                          />
                          {errors[`additional-${index}-name`] && (
                            <span className="error-text">{errors[`additional-${index}-name`]}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Age *</label>
                          <input
                            type="number"
                            placeholder="Age"
                            value={passenger.age}
                            onChange={(e) =>
                              handleAdditionalChange(index, "age", e.target.value)
                            }
                            min="1"
                            max="120"
                            className={errors[`additional-${index}-age`] ? "error" : ""}
                          />
                          {errors[`additional-${index}-age`] && (
                            <span className="error-text">{errors[`additional-${index}-age`]}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Gender (Optional)</label>
                          <select
                            value={passenger.gender}
                            onChange={(e) =>
                              handleAdditionalChange(index, "gender", e.target.value)
                            }
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="form-group full-width">
                          <label>
                            <FaIdCard /> ID Proof Number (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="Enter ID proof number (optional)"
                            value={passenger.idProof}
                            onChange={(e) =>
                              handleAdditionalChange(index, "idProof", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button type="submit" className="btn-continue">
                Continue to Confirmation <FaArrowRight />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerInformation;