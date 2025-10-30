import React from 'react';
import { Link } from 'react-router-dom';
import '../../components/Navbar.css';

function BusinessNavbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/business/login" className="navbar-logo">
          ReviewQR
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/business/login" className="nav-links">
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/business/signup" className="nav-links">
              Signup
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default BusinessNavbar;