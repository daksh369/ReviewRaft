import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <QrCode2Icon sx={{ fontSize: 40, mr: 1, color: '#1A73E8' }} />
          ReviewQR
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              <IconButton>
                <HomeIcon />
              </IconButton>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/scan-qr" className="nav-links">
                <IconButton>
                    <QrCodeScannerIcon />
                </IconButton>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;