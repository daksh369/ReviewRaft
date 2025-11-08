import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from './pages/HomePage';
import ScanQrPage from './pages/ScanQrPage';
import ReviewGeneratorPage from './pages/ReviewGeneratorPage';
import Navbar from './components/Navbar';
import Business from './business/Business';
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import LoginPage from "./business/pages/LoginPage";
import SignupPage from "./business/pages/SignupPage";

function AppRoutes() {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith('/business') &&
                     location.pathname !== '/review' &&
                     location.pathname !== '/login' &&
                     location.pathname !== '/signup';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/business/*" element={<Business />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/scan-qr" element={<ScanQrPage />} />
        <Route path="/review" element={<ReviewGeneratorPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default AppRoutes;