import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from './pages/HomePage';
import ScanQrPage from './pages/ScanQrPage';
import ReviewGeneratorPage from './pages/ReviewGeneratorPage';
import Navbar from './components/Navbar';
import Business from './business/Business';
import './App.css';
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

function App() {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith('/business') && location.pathname !== '/review';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/business/*" element={<Business />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/scan-qr" element={<ScanQrPage />} />
        <Route path="/review" element={<ReviewGeneratorPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
