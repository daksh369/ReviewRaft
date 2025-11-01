import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from './pages/HomePage';
import ScanQrPage from './pages/ScanQrPage';
import ReviewGeneratorPage from './pages/ReviewGeneratorPage';
import Navbar from './components/Navbar';
import Business from './business/Business';
import './App.css';
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

// A component to conditionally render the Navbar
const AppLayout = () => {
  const location = useLocation();
  // The review page should not have the main navbar
  const showNavbar = location.pathname !== '/review';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan-qr" element={<ScanQrPage />} />
        {/* The review page is now standalone */}
        <Route path="/review" element={<ReviewGeneratorPage />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* All business routes are handled by the Business component */}
          <Route path="/business/*" element={<Business />} />
          {/* All public-facing routes are here */}
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
