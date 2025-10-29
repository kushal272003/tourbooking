import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import tourService from '../services/tourService';
import { FaArrowLeft } from 'react-icons/fa';
import '../assets/TourForm.css';

const CreateTour = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        destination: '',
        price: '',
        duration: '',
        startDate: '',
        endDate: '',
        availableSeats: '',
        totalSeats: '',
        imageUrl: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (!isAdmin()) {
            alert('Access Denied! Admin only.');
            navigate('/');
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (parseInt(formData.availableSeats) > parseInt(formData.totalSeats)) {
            setError('Available seats cannot be greater than total seats');
            setLoading(false);
            return;
        }

        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            setError('End date must be after start date');
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
                totalSeats: parseInt(formData.totalSeats)
            };

            await tourService.createTour(tourData);
            alert('Tour created successfully!');
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'Failed to create tour');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tour-form-page">
            <div className="tour-form-container">
                <button onClick={() => navigate('/admin/dashboard')} className="btn-back">
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
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Tour'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTour;