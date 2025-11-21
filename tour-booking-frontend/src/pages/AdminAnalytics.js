// src/pages/AdminAnalytics.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import analyticsService from "../services/analyticsService";
import {
  FaRupeeSign,
  FaTicketAlt,
  FaUsers,
  FaChartLine,
  FaArrowLeft,
  FaCalendar,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import "../assets/AdminAnalytics.css";

const AdminAnalytics = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    if (!isAdmin()) {
      alert("Access Denied! Admin only.");
      navigate("/admin/dashboard");
      return;
    }
    fetchAnalytics(period);
  }, [period, isAdmin, navigate]);

  const fetchAnalytics = async (selectedPeriod) => {
    setLoading(true);
    try {
      const data = await analyticsService.getAnalytics(selectedPeriod);
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      alert("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  if (loading) {
    return <div className="loading-page">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="error-page">Failed to load analytics</div>;
  }

  // Chart Colors
  const COLORS = {
    primary: "#667eea",
    secondary: "#764ba2",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",
  };

  const PIE_COLORS = [COLORS.success, COLORS.danger];

  // Payment Success/Failure data for Pie Chart
  const paymentPieData = [
    { name: "Success", value: analytics.paymentStats.successfulPayments },
    { name: "Failed", value: analytics.paymentStats.failedPayments },
  ];

  // Booking Status data for Pie Chart
  const bookingStatusData = [
    {
      name: "Confirmed",
      value: analytics.bookingTrends.confirmedCount,
      color: COLORS.success,
    },
    {
      name: "Pending",
      value: analytics.bookingTrends.pendingCount,
      color: COLORS.warning,
    },
    {
      name: "Cancelled",
      value: analytics.bookingTrends.cancelledCount,
      color: COLORS.danger,
    },
  ];

  return (
    <div className="admin-analytics">
      <div className="analytics-container">
        {/* Header */}
        <div className="analytics-header">
          <div className="header-left">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="btn-back"
            >
              <FaArrowLeft /> Back to Dashboard
            </button>
            <h1>Analytics Dashboard</h1>
          </div>

          {/* Period Filter */}
          <div className="period-filter">
            <FaCalendar className="calendar-icon" />
            <button
              className={period === "daily" ? "active" : ""}
              onClick={() => handlePeriodChange("daily")}
            >
              Daily
            </button>
            <button
              className={period === "monthly" ? "active" : ""}
              onClick={() => handlePeriodChange("monthly")}
            >
              Monthly
            </button>
            <button
              className={period === "yearly" ? "active" : ""}
              onClick={() => handlePeriodChange("yearly")}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card revenue">
            <div className="stat-icon">
              <FaRupeeSign />
            </div>
            <div className="stat-content">
              <h3>₹{analytics.totalRevenue.toLocaleString("en-IN")}</h3>
              <p>Total Revenue</p>
            </div>
          </div>

          <div className="stat-card bookings">
            <div className="stat-icon">
              <FaTicketAlt />
            </div>
            <div className="stat-content">
              <h3>{analytics.totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>

          <div className="stat-card users">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{analytics.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card success-rate">
            <div className="stat-icon">
              <FaChartLine />
            </div>
            <div className="stat-content">
              <h3>{analytics.paymentStats.successRate.toFixed(1)}%</h3>
              <p>Payment Success Rate</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Revenue Chart */}
          <div className="chart-card full-width">
            <h3>Revenue Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) =>
                    name === "revenue"
                      ? `₹${value.toLocaleString("en-IN")}`
                      : value
                  }
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.primary}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue (₹)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Popular Destinations */}
          <div className="chart-card">
            <h3>Popular Destinations</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.popularDestinations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="destination" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookingCount" fill={COLORS.primary} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Booking Trends */}
          <div className="chart-card">
            <h3>Booking Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.bookingTrends.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="confirmed"
                  stroke={COLORS.success}
                  strokeWidth={2}
                  name="Confirmed"
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke={COLORS.warning}
                  strokeWidth={2}
                  name="Pending"
                />
                <Line
                  type="monotone"
                  dataKey="cancelled"
                  stroke={COLORS.danger}
                  strokeWidth={2}
                  name="Cancelled"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Success Rate */}
          <div className="chart-card">
            <h3>Payment Success Rate</h3>
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={paymentPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="payment-stats">
                <p>
                  <span className="success">✓ Success:</span>{" "}
                  {analytics.paymentStats.successfulPayments}
                </p>
                <p>
                  <span className="failed">✗ Failed:</span>{" "}
                  {analytics.paymentStats.failedPayments}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Status Distribution */}
          <div className="chart-card">
            <h3>Booking Status</h3>
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="booking-stats">
                <p>
                  <span className="confirmed">● Confirmed:</span>{" "}
                  {analytics.bookingTrends.confirmedCount}
                </p>
                <p>
                  <span className="pending">● Pending:</span>{" "}
                  {analytics.bookingTrends.pendingCount}
                </p>
                <p>
                  <span className="cancelled">● Cancelled:</span>{" "}
                  {analytics.bookingTrends.cancelledCount}
                </p>
              </div>
            </div>
          </div>

          {/* User Growth */}
          <div className="chart-card full-width">
            <h3>User Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.userGrowth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.info} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={COLORS.info} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="totalUsers"
                  stroke={COLORS.info}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  name="Total Users"
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke={COLORS.success}
                  strokeWidth={2}
                  name="New Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Rated Tours */}
          <div className="chart-card full-width">
            <h3>Top Rated Tours</h3>
            <div className="top-tours-list">
              {analytics.topRatedTours.length > 0 ? (
                analytics.topRatedTours.map((tour, index) => (
                  <div key={tour.tourId} className="tour-rating-item">
                    <div className="tour-rank">#{index + 1}</div>
                    <div className="tour-details">
                      <h4>{tour.tourTitle}</h4>
                      <div className="tour-meta">
                        <span className="rating">
                          ⭐ {tour.averageRating.toFixed(1)}
                        </span>
                        <span className="reviews">
                          {tour.totalReviews} reviews
                        </span>
                        <span className="bookings">
                          {tour.totalBookings} bookings
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No reviews yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;