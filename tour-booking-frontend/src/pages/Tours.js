import React, { useState, useEffect } from 'react';
import tourService from '../services/tourService';
import TourCard from '../components/TourCard';
import { FaSearch, FaFilter } from 'react-icons/fa';
import '../assets/Tours.css';

const Tours = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filter, setFilter] = useState('all'); // all, available, upcoming

    useEffect(() => {
        fetchTours();
    }, [filter]);

    const fetchTours = async () => {
        setLoading(true);
        setError('');
        
        try {
            let data;
            
            switch (filter) {
                case 'available':
                    data = await tourService.getAvailableTours();
                    break;
                case 'upcoming':
                    data = await tourService.getUpcomingTours();
                    break;
                default:
                    data = await tourService.getAllTours();
            }
            
            setTours(data);
        } catch (err) {
            setError('Failed to load tours. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!searchKeyword.trim()) {
            fetchTours();
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await tourService.searchTours(searchKeyword);
            setTours(data);
        } catch (err) {
            setError('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setSearchKeyword(''); // Clear search when filter changes
    };

    return (
        <div className="tours-page">
            <div className="tours-header">
                <h1>Explore Amazing Tours</h1>
                <p>Discover your next adventure with our curated tour packages</p>
            </div>

            <div className="tours-controls">
                <form onSubmit={handleSearch} className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search tours by title..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>

                <div className="filter-buttons">
                    <FaFilter className="filter-icon" />
                    <button 
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => handleFilterChange('all')}
                    >
                        All Tours
                    </button>
                    <button 
                        className={filter === 'available' ? 'active' : ''}
                        onClick={() => handleFilterChange('available')}
                    >
                        Available
                    </button>
                    <button 
                        className={filter === 'upcoming' ? 'active' : ''}
                        onClick={() => handleFilterChange('upcoming')}
                    >
                        Upcoming
                    </button>
                </div>
            </div>

            {loading && <div className="loading">Loading tours...</div>}
            
            {error && <div className="error-box">{error}</div>}

            {!loading && !error && tours.length === 0 && (
                <div className="no-tours">
                    <h3>No tours found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            )}

            {!loading && !error && tours.length > 0 && (
                <div className="tours-grid">
                    {tours.map(tour => (
                        <TourCard key={tour.id} tour={tour} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tours;