import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import BusinessNavbar from './components/BusinessNavbar';
import ProtectedRoute from './components/ProtectedRoute';
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
  // Define a standard height for the navbar to use as an offset for the page content.
  const navbarHeight = '64px';

  return (
      <>
        <BusinessNavbar />
        <Box sx={{ pt: navbarHeight }}>
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
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
