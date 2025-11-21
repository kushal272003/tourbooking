// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import tourService from "../services/tourService";
import bookingService from "../services/bookingService";
import {
  FaUsers,
  FaMapMarkedAlt,
  FaTicketAlt,
  FaRupeeSign,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaChartLine, // ✅ NEW: Analytics icon
} from "react-icons/fa";
import "../assets/AdminDashboard.css";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalTours: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
  });

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) {
      alert("Access Denied! Admin only.");
      navigate("/");
      return;
    }
    fetchDashboardData();
  }, [isAdmin, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const toursData = await tourService.getAllTours();
      setTours(Array.isArray(toursData) ? toursData : []);

      const bookingsData = await bookingService.getAllBookings();

      const totalRevenue = bookingsData
        .filter((b) => b.status !== "CANCELLED")
        .reduce((sum, b) => sum + b.totalPrice, 0);

      const pendingBookings = bookingsData.filter(
        (b) => b.status === "PENDING"
      ).length;

      setStats({
        totalTours: toursData.length,
        totalBookings: bookingsData.length,
        totalRevenue,
        pendingBookings,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTour = async (tourId) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;

    try {
      await tourService.deleteTour(tourId);
      alert("Tour deleted successfully!");
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete tour");
    }
  };

  if (loading) {
    return <div className="loading-page">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name || "Admin"}!</p>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon tours">
              <FaMapMarkedAlt />
            </div>
            <div className="stat-content">
              <h3>{stats.totalTours}</h3>
              <p>Total Tours</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bookings">
              <FaTicketAlt />
            </div>
            <div className="stat-content">
              <h3>{stats.totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">
              <FaRupeeSign />
            </div>
            <div className="stat-content">
              <h3>₹{stats.totalRevenue.toLocaleString("en-IN")}</h3>
              <p>Total Revenue</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{stats.pendingBookings}</h3>
              <p>Pending Bookings</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          {/* ✅ NEW: Analytics Button */}
          <button
            className="action-card analytics-card"
            onClick={() => navigate("/admin/analytics")}
          >
            <FaChartLine className="action-icon" />
            <div>
              <h3>Analytics Dashboard</h3>
              <p>View detailed reports and charts</p>
            </div>
          </button>

          <button
            className="action-card"
            onClick={() => navigate("/admin/bookings")}
          >
            <FaTicketAlt className="action-icon" />
            <div>
              <h3>Manage Bookings</h3>
              <p>View and manage all customer bookings</p>
            </div>
          </button>

          <button
            className="action-card"
            onClick={() => navigate("/admin/tours/create")}
          >
            <FaPlus className="action-icon" />
            <div>
              <h3>Create Tour</h3>
              <p>Add a new tour package</p>
            </div>
          </button>
        </div>

        {/* Manage Tours */}
        <div className="section-header">
          <h2>Manage Tours</h2>
          <button
            className="btn-create"
            onClick={() => navigate("/admin/tours/create")}
          >
            <FaPlus /> Create New Tour
          </button>
        </div>

        <div className="admin-tours-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tour Name</th>
                <th>Destination</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Available Seats</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tours.map((tour) => (
                <tr key={tour.id}>
                  <td>#{tour.id}</td>
                  <td className="tour-name-cell">
                    <img
                      src={tour.imageUrl || "https://via.placeholder.com/50"}
                      alt={tour.title}
                      className="tour-thumb"
                    />
                    <span>{tour.title}</span>
                  </td>
                  <td>{tour.destination}</td>
                  <td>₹{tour.price.toLocaleString("en-IN")}</td>
                  <td>{tour.duration} days</td>
                  <td>
                    <span
                      className={
                        tour.availableSeats > 0
                          ? "seats-available"
                          : "seats-full"
                      }
                    >
                      {tour.availableSeats}/{tour.totalSeats}
                    </span>
                  </td>
                  <td>
                    {tour.availableSeats > 0 ? (
                      <span className="badge-active">Active</span>
                    ) : (
                      <span className="badge-full">Full</span>
                    )}
                  </td>
                  <td className="action-buttons">
                    <button
                      className="btn-icon btn-view"
                      onClick={() => navigate(`/tours/${tour.id}`)}
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => navigate(`/admin/tours/edit/${tour.id}`)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDeleteTour(tour.id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tours.length === 0 && (
            <div className="no-data">
              <p>No tours found. Create your first tour!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;