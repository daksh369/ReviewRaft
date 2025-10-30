import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import ScanQrPage from './pages/ScanQrPage';
import Navbar from './components/Navbar';
import Business from './business/Business';
import './App.css';

function App() {
  return (
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
              </Routes>
            </>
          }
        />
        <Route path="/business/*" element={<Business />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;