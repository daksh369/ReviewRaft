import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import ScanQrPage from './pages/ScanQrPage';
import ReviewGeneratorPage from './pages/ReviewGeneratorPage';
import Navbar from './components/Navbar';
import Business from './business/Business';
import './App.css';
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/scan-qr" element={<ScanQrPage />} />
                  <Route path="/review" element={<ReviewGeneratorPage />} />
                </Routes>
              </>
            }
          />
          <Route path="/business/*" element={<Business />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;