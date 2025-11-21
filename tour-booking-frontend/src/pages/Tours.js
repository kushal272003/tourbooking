import React, { useState, useEffect } from 'react';
import tourService from '../services/tourService';
import TourCard from '../components/TourCard';
import AdvancedFilters from '../components/AdvancedFilters';
import { FaSearch, FaFilter } from 'react-icons/fa';
import '../assets/Tours.css';
import { useParams } from 'react-router-dom';


const Tours = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [totalResults, setTotalResults] = useState(0);
    const [appliedFilters, setAppliedFilters] = useState({});
    const [showFilters, setShowFilters] = useState(true);
    const { category } = useParams();


    useEffect(() => {
  if (category) {
    fetchToursByCategory(category);
  } else {
    fetchTours();
  }
}, [category]);


const fetchToursByCategory = async (category) => {
  setLoading(true);
  setError('');
  try {
    const data = await tourService.getToursByCategory(category);
    setTours(data);
    setTotalResults(data.length);
  } catch (err) {
    setError('Failed to load tours for this category.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};


    const fetchTours = async () => {
        setLoading(true);
        setError('');
        
        try {
            const data = await tourService.getAllTours();
            setTours(data);
            setTotalResults(data.length);
        } catch (err) {
            setError('Failed to load tours. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle basic search (from search bar)
    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!searchKeyword.trim()) {
            fetchTours();
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Use advanced search with keyword only
            const response = await tourService.advancedSearch({ 
                keyword: searchKeyword 
            });
            setTours(response.tours);
            setTotalResults(response.totalResults);
        } catch (err) {
            setError('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle advanced filter change
    const handleFilterChange = async (filters) => {
        setLoading(true);
        setError('');
        setAppliedFilters(filters);

        try {
            // Combine search keyword with filters
            const combinedFilters = {
                ...filters,
                keyword: searchKeyword || filters.keyword
            };

            console.log('Applying filters:', combinedFilters);

            const response = await tourService.advancedSearch(combinedFilters);
            
            setTours(response.tours);
            setTotalResults(response.totalResults);
            
            console.log(`Found ${response.totalResults} tours`);

        } catch (err) {
            setError('Failed to apply filters. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle filter reset
    const handleFilterReset = () => {
        setSearchKeyword('');
        setAppliedFilters({});
        fetchTours();
    };

    // Check if filters are active
    const hasActiveFilters = () => {
        return Object.keys(appliedFilters).length > 0 || searchKeyword.trim() !== '';
    };

    // Get filter summary text
    const getFilterSummary = () => {
        const filters = [];
        
        if (searchKeyword) {
            filters.push(`Search: "${searchKeyword}"`);
        }
        if (appliedFilters.minPrice || appliedFilters.maxPrice) {
            filters.push(`Price: ₹${appliedFilters.minPrice || 0} - ₹${appliedFilters.maxPrice || '∞'}`);
        }
        if (appliedFilters.minDuration || appliedFilters.maxDuration) {
            filters.push(`Duration: ${appliedFilters.minDuration || 0}-${appliedFilters.maxDuration || '∞'} days`);
        }
        if (appliedFilters.startDate) {
            filters.push(`From: ${appliedFilters.startDate}`);
        }
        if (appliedFilters.endDate) {
            filters.push(`To: ${appliedFilters.endDate}`);
        }
        if (appliedFilters.availableOnly) {
            filters.push('Available Only');
        }
        if (appliedFilters.sortBy) {
            const sortLabels = {
                'price_asc': 'Price: Low to High',
                'price_desc': 'Price: High to Low',
                'duration_asc': 'Duration: Short to Long',
                'duration_desc': 'Duration: Long to Short',
                'date_asc': 'Date: Earliest First',
                'date_desc': 'Date: Latest First'
            };
            filters.push(`Sort: ${sortLabels[appliedFilters.sortBy] || appliedFilters.sortBy}`);
        }

        return filters;
    };

    return (
        <div className="tours-page">
            <div className="tours-header">
                <h1>Explore Amazing Tours</h1>
                <p>Discover your next adventure with our curated tour packages</p>
            </div>

            <div className="tours-main-container">
                {/* Sidebar with Filters */}
                <aside className={`tours-sidebar ${showFilters ? 'visible' : 'hidden'}`}>
                    <AdvancedFilters 
                        onFilterChange={handleFilterChange}
                        onReset={handleFilterReset}
                    />
                </aside>

                {/* Main Content Area */}
                <div className="tours-content-area">
                    {/* Search Bar and Toggle */}
                    <div className="tours-controls">
                        <form onSubmit={handleSearch} className="search-bar">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search tours by title or destination..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                            <button type="submit">Search</button>
                        </form>

                        {/* Mobile Filter Toggle */}
                        <button 
                            className="mobile-filter-toggle"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FaFilter /> Filters
                        </button>
                    </div>

                    {/* Results Info */}
                    <div className="results-info">
                        <div className="results-count">
                            <strong>{totalResults}</strong> {totalResults === 1 ? 'tour' : 'tours'} found
                        </div>
                        
                        {hasActiveFilters() && (
                            <div className="active-filters-summary">
                                <span className="filters-label">Active Filters:</span>
                                <div className="filters-tags">
                                    {getFilterSummary().map((filter, index) => (
                                        <span key={index} className="filter-tag">
                                            {filter}
                                        </span>
                                    ))}
                                </div>
                                <button 
                                    className="clear-all-btn"
                                    onClick={handleFilterReset}
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Loading State */}
                    {loading && <div className="loading">Loading tours...</div>}
                    
                    {/* Error State */}
                    {error && <div className="error-box">{error}</div>}

                    {/* No Tours Found */}
                    {!loading && !error && tours.length === 0 && (
                        <div className="no-tours">
                            <div className="no-tours-icon">🔍</div>
                            <h3>No tours found</h3>
                            <p>Try adjusting your search or filters</p>
                            <button 
                                className="btn-reset-filters"
                                onClick={handleFilterReset}
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}

                    {/* Tours Grid */}
                    {!loading && !error && tours.length > 0 && (
                        <div className="tours-grid">
                            {tours.map(tour => (
                                <TourCard key={tour.id} tour={tour} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tours;