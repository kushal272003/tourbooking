import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaMapMarkedAlt,
  FaTicketAlt,
  FaCog,
} from "react-icons/fa";
import "../assets/Navbar.css";
import { FaHeart } from "react-icons/fa";

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🌍 Tour Booking
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <FaHome /> Home
          </Link>
          <Link to="/tours" className="nav-link">
            <FaMapMarkedAlt /> Tours
          </Link>

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
              <button onClick={handleLogout} className="btn-logout">
                <FaSignOutAlt /> Logout
              </button>
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
