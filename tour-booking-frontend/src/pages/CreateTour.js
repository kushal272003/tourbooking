import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import tourService from "../services/tourService";
import { FaArrowLeft } from "react-icons/fa";
import "../assets/TourForm.css";

const CreateTour = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination: "",
    category: "",
    price: "",
    duration: "",
    startDate: "",
    endDate: "",
    availableSeats: "",
    totalSeats: "",
    imageUrl: "",
    imageUrl2: "",
    imageUrl3: "",
    itinerary: "",
    inclusions: "",
    exclusions: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (!isAdmin()) {
      alert("Access Denied! Admin only.");
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (parseInt(formData.availableSeats) > parseInt(formData.totalSeats)) {
      setError("Available seats cannot be greater than total seats");
      setLoading(false);
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError("End date must be after start date");
      setLoading(false);
      return;
    }

    try {
      // Convert strings to numbers
      const tourData = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        availableSeats: parseInt(formData.availableSeats),
        totalSeats: parseInt(formData.totalSeats),

        itinerary: formData.itinerary
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item !== ""),

        inclusions: formData.inclusions
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),

        exclusions: formData.exclusions
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
      };

      await tourService.createTour(tourData);
      alert("Tour created successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to create tour"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tour-form-page">
      <div className="tour-form-container">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="btn-back"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        <div className="form-header">
          <h1>Create New Tour</h1>
          <p>Fill in the details to create a new tour package</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="tour-form">
          <div className="form-row">
            <div className="form-group">
              <label>Tour Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Amazing Goa Beach Tour"
                required
              />
            </div>

            <div className="form-group">
              <label>Destination *</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g., Goa"
                required
              />
            </div>
          </div>{" "}
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="adventure">Adventure</option>
              <option value="pilgrimage">Pilgrimage</option>
              <option value="hillstation">Hillstation</option>
              <option value="wildlife">Wildlife</option>
              <option value="beach">Beach</option>
              <option value="cityescapes">Cityescapes</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the tour in detail..."
              rows="5"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="15000"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Duration (Days) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="5"
                min="1"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Total Seats *</label>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                placeholder="30"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Available Seats *</label>
              <input
                type="number"
                name="availableSeats"
                value={formData.availableSeats}
                onChange={handleChange}
                placeholder="30"
                min="0"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <small>Optional: Provide an image URL for the tour</small>
          </div>
          <div className="form-group">
            <label>Image URL 2</label>
            <input
              type="url"
              name="imageUrl2"
              value={formData.imageUrl2}
              onChange={handleChange}
              placeholder="https://example.com/image2.jpg"
            />
            <small>Optional: Provide a second image URL</small>
          </div>
          <div className="form-group">
            <label>Image URL 3</label>
            <input
              type="url"
              name="imageUrl3"
              value={formData.imageUrl3}
              onChange={handleChange}
              placeholder="https://example.com/image3.jpg"
            />
            <small>Optional: Provide a third image URL</small>
          </div>
          <div className="form-group">
            <label>Itinerary (Day-wise steps)</label>
            <textarea
              name="itinerary"
              value={formData.itinerary}
              onChange={handleChange}
              placeholder="Day 1: Arrival...\nDay 2: Sightseeing..."
              rows="4"
            />
            <small>Write each day on new line</small>
          </div>
          <div className="form-group">
            <label>Inclusions</label>
            <textarea
              name="inclusions"
              value={formData.inclusions}
              onChange={handleChange}
              placeholder="e.g., Breakfast, Hotel Stay, Transport"
              rows="3"
            />
            <small>Comma separated list</small>
          </div>
          <div className="form-group">
            <label>Exclusions</label>
            <textarea
              name="exclusions"
              value={formData.exclusions}
              onChange={handleChange}
              placeholder="e.g., Personal expenses, Extra meals"
              rows="3"
            />
            <small>Comma separated list</small>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/admin/dashboard")}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Creating..." : "Create Tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTour;
