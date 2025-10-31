import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import BusinessNavbar from './components/BusinessNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AddBusinessLinkPage from './pages/AddBusinessLinkPage';
import YourQrCodePage from './pages/YourQrCodePage';
import AutoReplyPage from './pages/AutoReplyPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

function Business() {
  const location = useLocation();
  const hideNavbar = ['/business/login', '/business/signup'].includes(location.pathname);

  // Define a standard height for the navbar to use as an offset for the page content.
  const navbarHeight = '64px'; 

  return (
      <>
        {!hideNavbar && <BusinessNavbar />}
        {/* This Box wraps the page content. We add paddingTop to push it below the navbar. */}
        <Box sx={{ pt: !hideNavbar ? navbarHeight : 0 }}>
          <Routes>
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
              path="your-qr-code/:docId"
              element={
                <ProtectedRoute>
                  <YourQrCodePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="auto-reply"
              element={
                <ProtectedRoute>
                  <AutoReplyPage />
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
          </Routes>
        </Box>
      </>
  );
}

export default Business;
