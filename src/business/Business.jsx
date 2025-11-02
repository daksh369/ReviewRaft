import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import BusinessNavbar from './components/BusinessNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AddBusinessLinkPage from './pages/AddBusinessLinkPage';
import YourQrCodePage from './pages/YourQrCodePage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import QrCodeRedirector from './pages/QrCodeRedirector';

// Placeholder for the new billing page
const BillingPage = () => (
    <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4">Subscription & Billing</Typography>
        <Typography variant="body1">This feature is coming soon!</Typography>
    </Box>
);

function Business() {
  const location = useLocation();
  // Correctly check against the full path
  const hideNavbar = ['/business/login', '/business/signup'].includes(location.pathname);

  // Define a standard height for the navbar to use as an offset for the page content.
  const navbarHeight = '64px'; 

  return (
      <>
        {!hideNavbar && <BusinessNavbar />}
        <Box sx={{ pt: !hideNavbar ? navbarHeight : 0 }}>
          <Routes>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="add-business-link"
              element={
                <ProtectedRoute>
                  <AddBusinessLinkPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="your-qr-code"
              element={
                <ProtectedRoute>
                  <QrCodeRedirector />
                </ProtectedRoute>
              }
            />
             <Route
              path="your-qr-code/:docId"
              element={
                <ProtectedRoute>
                  <YourQrCodePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile-settings"
              element={
                <ProtectedRoute>
                  <ProfileSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="billing"
              element={
                <ProtectedRoute>
                  <BillingPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
      </>
  );
}

export default Business;
