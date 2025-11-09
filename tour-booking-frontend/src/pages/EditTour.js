import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import tourService from '../services/tourService';
import { FaArrowLeft } from 'react-icons/fa';
import '../assets/TourForm.css';

const EditTour = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    category: '', // ✅ added same as CreateTour
    price: '',
    duration: '',
    startDate: '',
    endDate: '',
    availableSeats: '',
    totalSeats: '',
    imageUrl: '',
    imageUrl2: '', // ✅ new
    imageUrl3: ''  // ✅ new
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin()) {
      alert('Access Denied! Admin only.');
      navigate('/');
      return;
    }
    fetchTourData();
  }, [id]);

  const fetchTourData = async () => {
    setLoading(true);
    try {
      const tour = await tourService.getTourById(id);
      setFormData({
        title: tour.title,
        description: tour.description,
        destination: tour.destination,
        category: tour.category || '',
        price: tour.price,
        duration: tour.duration,
        startDate: tour.startDate,
        endDate: tour.endDate,
        availableSeats: tour.availableSeats,
        totalSeats: tour.totalSeats,
        imageUrl: tour.imageUrl || '',
        imageUrl2: tour.imageUrl2 || '',
        imageUrl3: tour.imageUrl3 || ''
      });
    } catch (err) {
      setError('Failed to load tour data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (parseInt(formData.availableSeats) > parseInt(formData.totalSeats)) {
      setError('Available seats cannot be greater than total seats');
      setSubmitting(false);
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('End date must be after start date');
      setSubmitting(false);
      return;
    }

    try {
      const tourData = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        availableSeats: parseInt(formData.availableSeats),
        totalSeats: parseInt(formData.totalSeats)
      };

      await tourService.updateTour(id, tourData);
      alert('Tour updated successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to update tour');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-page">Loading tour data...</div>;
  }

  return (
    <div className="tour-form-page">
      <div className="tour-form-container">
        <button onClick={() => navigate('/admin/dashboard')} className="btn-back">
          <FaArrowLeft /> Back to Dashboard
        </button>

        <div className="form-header">
          <h1>Edit Tour</h1>
          <p>Update tour details</p>
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
                required
              />
            </div>
          </div>

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
                min="0"
                required
              />
            </div>
          </div>

          {/* ✅ Three Image URL fields */}
          <div className="form-group">
            <label>Image URL 1</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image1.jpg"
            />
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
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/admin/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Tour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTour;
