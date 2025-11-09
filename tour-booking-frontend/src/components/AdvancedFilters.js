import React, { useState, useEffect } from 'react';
import tourService from '../services/tourService';
import { 
    FaFilter, 
    FaRupeeSign, 
    FaClock, 
    FaCalendar,
    FaSort,
    FaTimes,
    FaRedo
} from 'react-icons/fa';
import '../assets/AdvancedFilters.css';

const AdvancedFilters = ({ onFilterChange, onReset }) => {
    // Price Range State
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [selectedPriceMin, setSelectedPriceMin] = useState(0);
    const [selectedPriceMax, setSelectedPriceMax] = useState(100000);

    // Duration State
    const [selectedDuration, setSelectedDuration] = useState('all');

    // Date Range State
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');

    // Available Only State
    const [availableOnly, setAvailableOnly] = useState(false);

    // Sort State
    const [sortBy, setSortBy] = useState('');

    // Destinations State (for future use)
    const [destinations, setDestinations] = useState([]);

    // Filter panel visibility
    const [isExpanded, setIsExpanded] = useState(true);

    // Load initial data
    useEffect(() => {
        loadPriceRange();
        loadDestinations();
    }, []);

    const loadPriceRange = async () => {
        try {
            const range = await tourService.getPriceRange();
            setPriceRange({ min: range.minPrice, max: range.maxPrice });
            setSelectedPriceMin(range.minPrice);
            setSelectedPriceMax(range.maxPrice);
        } catch (error) {
            console.error('Error loading price range:', error);
        }
    };

    const loadDestinations = async () => {
        try {
            const dests = await tourService.getAllDestinations();
            setDestinations(dests);
        } catch (error) {
            console.error('Error loading destinations:', error);
        }
    };

    // Handle filter application
    const handleApplyFilters = () => {
        const filters = buildFiltersObject();
        onFilterChange(filters);
    };

    // Build filters object
    const buildFiltersObject = () => {
        const filters = {};

        // Price filter
        if (selectedPriceMin !== priceRange.min || selectedPriceMax !== priceRange.max) {
            filters.minPrice = selectedPriceMin;
            filters.maxPrice = selectedPriceMax;
        }

        // Duration filter
        if (selectedDuration !== 'all') {
            const durationRanges = {
                'short': { min: 1, max: 3 },
                'medium': { min: 4, max: 7 },
                'long': { min: 8, max: 14 },
                'extended': { min: 15, max: 30 }
            };
            
            if (durationRanges[selectedDuration]) {
                filters.minDuration = durationRanges[selectedDuration].min;
                filters.maxDuration = durationRanges[selectedDuration].max;
            }
        }

        // Date range filter
        if (selectedStartDate) {
            filters.startDate = selectedStartDate;
        }
        if (selectedEndDate) {
            filters.endDate = selectedEndDate;
        }

        // Available only filter
        if (availableOnly) {
            filters.availableOnly = true;
        }

        // Sort filter
        if (sortBy) {
            filters.sortBy = sortBy;
        }

        return filters;
    };

    // Reset all filters
    const handleResetFilters = () => {
        setSelectedPriceMin(priceRange.min);
        setSelectedPriceMax(priceRange.max);
        setSelectedDuration('all');
        setSelectedStartDate('');
        setSelectedEndDate('');
        setAvailableOnly(false);
        setSortBy('');
        onReset();
    };

    // Check if any filters are active
    const hasActiveFilters = () => {
        return selectedPriceMin !== priceRange.min ||
               selectedPriceMax !== priceRange.max ||
               selectedDuration !== 'all' ||
               selectedStartDate !== '' ||
               selectedEndDate !== '' ||
               availableOnly ||
               sortBy !== '';
    };

    return (
        <div className={`advanced-filters ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="filters-header">
                <div className="header-title">
                    <FaFilter className="filter-icon" />
                    <h3>Advanced Filters</h3>
                </div>
                <button 
                    className="toggle-btn"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? <FaTimes /> : <FaFilter />}
                </button>
            </div>

            {isExpanded && (
                <div className="filters-content">
                    {/* Price Range Slider */}
                    <div className="filter-section">
                        <label className="filter-label">
                            <FaRupeeSign className="label-icon" />
                            Price Range
                        </label>
                        <div className="price-display">
                            <span>₹{selectedPriceMin.toLocaleString('en-IN')}</span>
                            <span>-</span>
                            <span>₹{selectedPriceMax.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="dual-range-slider">
                            <input
                                type="range"
                                min={priceRange.min}
                                max={priceRange.max}
                                value={selectedPriceMin}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value < selectedPriceMax) {
                                        setSelectedPriceMin(value);
                                    }
                                }}
                                className="range-slider"
                            />
                            <input
                                type="range"
                                min={priceRange.min}
                                max={priceRange.max}
                                value={selectedPriceMax}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value > selectedPriceMin) {
                                        setSelectedPriceMax(value);
                                    }
                                }}
                                className="range-slider"
                            />
                        </div>
                    </div>

                    {/* Duration Filter */}
                    <div className="filter-section">
                        <label className="filter-label">
                            <FaClock className="label-icon" />
                            Duration
                        </label>
                        <select 
                            value={selectedDuration}
                            onChange={(e) => setSelectedDuration(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Durations</option>
                            <option value="short">1-3 Days (Short Trip)</option>
                            <option value="medium">4-7 Days (Week Long)</option>
                            <option value="long">8-14 Days (Extended)</option>
                            <option value="extended">15-30 Days (Long Vacation)</option>
                        </select>
                    </div>

                    {/* Date Range Picker */}
                    <div className="filter-section">
                        <label className="filter-label">
                            <FaCalendar className="label-icon" />
                            Travel Dates
                        </label>
                        <div className="date-inputs">
                            <div className="date-input-group">
                                <label>From</label>
                                <input
                                    type="date"
                                    value={selectedStartDate}
                                    onChange={(e) => setSelectedStartDate(e.target.value)}
                                    className="date-input"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="date-input-group">
                                <label>To</label>
                                <input
                                    type="date"
                                    value={selectedEndDate}
                                    onChange={(e) => setSelectedEndDate(e.target.value)}
                                    className="date-input"
                                    min={selectedStartDate || new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sort By */}
                    <div className="filter-section">
                        <label className="filter-label">
                            <FaSort className="label-icon" />
                            Sort By
                        </label>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Default</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="duration_asc">Duration: Short to Long</option>
                            <option value="duration_desc">Duration: Long to Short</option>
                            <option value="date_asc">Date: Earliest First</option>
                            <option value="date_desc">Date: Latest First</option>
                        </select>
                    </div>

                    {/* Available Only Checkbox */}
                    <div className="filter-section">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={availableOnly}
                                onChange={(e) => setAvailableOnly(e.target.checked)}
                            />
                            <span>Show only available tours</span>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="filter-actions">
                        <button 
                            className="btn-reset"
                            onClick={handleResetFilters}
                            disabled={!hasActiveFilters()}
                        >
                            <FaRedo /> Reset
                        </button>
                        <button 
                            className="btn-apply"
                            onClick={handleApplyFilters}
                        >
                            <FaFilter /> Apply Filters
                        </button>
                    </div>

                    {/* Active Filters Count */}
                    {hasActiveFilters() && (
                        <div className="active-filters-badge">
                            {Object.keys(buildFiltersObject()).length} filter(s) active
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdvancedFilters;