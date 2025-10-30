import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import BusinessNavbar from './components/BusinessNavbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AddBusinessLinkPage from './pages/AddBusinessLinkPage';
import YourQrCodePage from './pages/YourQrCodePage';
import { Box } from '@mui/material';

function Business() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/business/add-business-link' || location.pathname === '/business/your-qr-code';

  return (
    <>
      {!hideNavbar && <BusinessNavbar />}
      <Box>
        <Routes>
          <Route path="/" element={<Navigate to="/business/login" />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="add-business-link" element={<AddBusinessLinkPage />} />
          <Route path="your-qr-code" element={<YourQrCodePage />} />
        </Routes>
      </Box>
    </>
  );
}

export default Business;