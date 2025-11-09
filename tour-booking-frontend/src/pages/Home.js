import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../assets/Home.css';
import logo from '../assets/images/logo.png'; // apna logo path sahi kar lena
import beach from "../assets/images/beach.jpg";
import mountain from "../assets/images/mountain.jpg";
import city from "../assets/images/city.jpg";



const Home = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <img src={logo} alt="Company Logo" className="home-logo" />
        <h1>Welcome to <span>krial travels</span> 🌍</h1>
        <p className="hero-subtitle">
          Explore the world with our exclusive and affordable tour packages.
        </p>

        {!isAuthenticated && (
          <button className="btn-primary" onClick={() => navigate('/login')}>
            Get Started
          </button>
        )}

       
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>Our Popular Tours</h2>
        <div className="service-grid">
          <div className="service-card">
            <img src={beach} alt="Beach" />
            <h3>Beach Getaways</h3>
            <p>Relax on beautiful beaches with luxury stays and ocean views.</p>
          </div>

          <div className="service-card">
            <img src={mountain} alt="Mountains" />
            <h3>Mountain Adventures</h3>
            <p>Perfect for trekking lovers and nature explorers.</p>
          </div>

          <div className="service-card">
            <img src={city} alt="City Tours" />
            <h3>City Escapes</h3>
            <p>Discover the best urban destinations with local guides.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>Why Choose Us?</h2>
        <p>
          At <strong>Tour Booking</strong>, we believe in creating unforgettable travel experiences.  
          With our expert team, curated destinations, and customer-first approach, we make sure every trip feels special.
        </p>
      </section>
    </div>
  );
};

export default Home;
