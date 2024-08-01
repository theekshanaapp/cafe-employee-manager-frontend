import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">Café Employee Manager</h1>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Cafes</Link>
          <Link to="/employees" className="nav-link">Employees</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
