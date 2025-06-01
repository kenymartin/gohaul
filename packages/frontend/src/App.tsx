import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/auth.store';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import BrowseShipmentsPage from './pages/BrowseShipmentsPage';
import CreateShipmentPage from './pages/shipments/CreateShipmentPage';
import ShipmentDetailsPage from './pages/shipments/ShipmentDetailsPage';

// New pages
import VehiclesPage from './pages/vehicles/VehiclesPage';
import BidsPage from './pages/bids/BidsPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import ProfilePage from './pages/profile/ProfilePage';
import TrackingPage from './pages/tracking/TrackingPage';
import ReviewsPage from './pages/reviews/ReviewsPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  return !user ? <>{children}</> : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
        </Route>
        
        <Route
          path="/browse"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<BrowseShipmentsPage />} />
        </Route>
        
        <Route
          path="/shipments"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="create" element={<CreateShipmentPage />} />
          <Route path=":id" element={<ShipmentDetailsPage />} />
        </Route>

        {/* New routes */}
        <Route
          path="/vehicles"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<VehiclesPage />} />
        </Route>

        <Route
          path="/bids"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<BidsPage />} />
        </Route>

        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<NotificationsPage />} />
        </Route>

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<ProfilePage />} />
        </Route>

        <Route
          path="/tracking"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<TrackingPage />} />
        </Route>

        <Route
          path="/reviews"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<ReviewsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App; 