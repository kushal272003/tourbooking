import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Tours from "./pages/Tours";
import TourDetails from "./pages/TourDetails";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTour from "./pages/CreateTour"; // Import
import EditTour from "./pages/EditTour"; // Import
import AllBookings from "./pages/AllBookings";
import MyWishlist from "./pages/MyWishlist";
import UserProfile from "./pages/UserProfile";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public Pages */}
          <Route
            path="/tours"
            element={
              <Layout>
                <Tours />
              </Layout>
            }
          />

          <Route
            path="/tours/:id"
            element={
              <Layout>
                <TourDetails />
              </Layout>
            }
          />

          {/* Protected Pages */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyBookings />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserProfile />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tours/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreateTour />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tours/edit/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <EditTour />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute>
                <Layout>
                  <AllBookings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-wishlist"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyWishlist />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/tours" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
