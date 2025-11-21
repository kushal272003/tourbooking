import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../assets/Home.css';
import logo from '../assets/images/logo.png'; // apna logo path sahi kar lena
import beach from "../assets/images/beach.jpg";
import mountain from "../assets/images/mountain.jpg";
import city from "../assets/images/city.jpg";
import pil from "../assets/images/pilgrimage.webp";
import wild from '../assets/images/wildlife.png';
import hill from '../assets/images/hillStation.jpeg';



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
        <video autoPlay loop muted className="hero-video">
    <source src={require('../assets/videos/travel.mp4')} type="video/mp4" />
  </video>
        <img src={logo} alt="Company Logo" className="home-logo" />
        <h1>Welcome to <span>krial travels</span> 🌍</h1>

         <h2 className="tagline">Your Journey, Our Passion ✈️</h2>

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
            <img src={mountain} alt="Adventures" />
            <h3> Adventures</h3>
            <p>Perfect for trekking lovers and nature explorers.</p>
          </div>

          <div className="service-card">
            <img src={city} alt="City Tours" />
            <h3>City Escapes</h3>
            <p>Discover the best urban destinations with local guides.</p>
          </div>

           <div className="service-card">
            <img src={pil} alt="Pilgrimage" />
            <h3>Pilgrimage</h3>
            <p>Discover sacred journeys guided by local experts.</p>
          </div>
           <div className="service-card">
            <img src={wild} alt="Pilgrimage" />
            <h3>Wildlife</h3>
            <p>Explore the wild side of nature with expert local guides.</p>
          </div>

           <div className="service-card">
            <img src={hill} alt="HillStation" />
            <h3>Hillstation</h3>
            <p>Relax amid misty mountains and scenic hill escapes</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
  <h2>Why Choose Us?</h2>
  <div className="why-grid">
    <div className="why-card">
      <h3>Expert Guidance</h3>
      <p>Our experienced local guides ensure every journey is safe, enjoyable, and truly memorable.</p>
    </div>

    <div className="why-card">
      <h3>Affordable Packages</h3>
      <p>Get the best value for your money with flexible plans and zero hidden costs.</p>
    </div>

    <div className="why-card">
      <h3>24/7 Support</h3>
      <p>We’re always available to assist you — before, during, and after your trip.</p>
    </div>

    <div className="why-card">
      <h3>Customized Trips</h3>
      <p>Plan your trip your way — from destinations to activities, fully personalized for you.</p>
    </div>
  </div>
</section>

    </div>
  );
};

export default Home;
