import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/logo.png";
import {
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaMapMarkedAlt,
  FaTicketAlt,
  FaCog,
  FaChevronDown,
  FaHeart,
} from "react-icons/fa";
import "../assets/Navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Company Logo" className="logo-image" />
          <span className="company-name">Krial Travels</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <FaHome /> Home
          </Link>

          {/* Dropdown for Tours */}
          <div
            className="nav-link dropdown"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <span className="dropdown-toggle">
              <FaMapMarkedAlt /> Tours <FaChevronDown className="dropdown-icon" />
            </span>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/tours/category/adventure" className="dropdown-item">
                  Adventure Tours
                </Link>
                <Link to="/tours/category/pilgrimage" className="dropdown-item">
                  Pilgrimage Tours
                </Link>
                <Link to="/tours/category/hillstation" className="dropdown-item">
                  HillStation Tours
                </Link>
                <Link to="/tours/category/beach" className="dropdown-item">
                  Beach Tours
                </Link>
                <Link to="/tours/category/wildlife" className="dropdown-item">
                  Wildlife Tours
                </Link>
                 <Link to="/tours/category/cityescapes" className="dropdown-item">
                  CityEscapes Tours
                </Link>
              </div>
            )}
          </div>

          {isAuthenticated && (
            <>
              <Link to="/my-bookings" className="nav-link">
                <FaTicketAlt /> My Bookings
              </Link>

              <Link to="/my-wishlist" className="nav-link">
                <FaHeart /> Wishlist
              </Link>

              {isAdmin() && (
                <Link to="/admin/dashboard" className="nav-link admin-link">
                  <FaCog /> Admin
                </Link>
              )}
            </>
          )}

          {isAuthenticated ? (
            <div className="nav-user">
              <span className="user-name" onClick={() => navigate("/profile")}>
                <FaUser /> {user.name}
              </span>
              
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/register" className="btn-register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
