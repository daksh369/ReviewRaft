import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import HomePage from './pages/HomePage';
import ScanQrPage from './pages/ScanQrPage';
import ReviewGeneratorPage from './pages/ReviewGeneratorPage';
import Navbar from './components/Navbar';
import Business from './business/Business';
import './App.css';
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

// A component to conditionally render the Navbar and provide a layout for public pages
const AppLayout = () => {
  const location = useLocation();
  // The review page should not have the main navbar
  const showNavbar = location.pathname !== '/review';

  return (
    <>
      {showNavbar && <Navbar />}
      <Outlet />
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* All business routes are handled by the Business component */}
        <Route path="/business/*" element={<Business />} />

        {/* All public-facing routes are nested under the AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan-qr" element={<ScanQrPage />} />
        </Route>
        
        {/* The review page is now a standalone route */}
        <Route path="/review" element={<ReviewGeneratorPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
