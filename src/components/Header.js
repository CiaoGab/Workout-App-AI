import React, { useState } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.classList.toggle('menu-open', !isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.classList.remove('menu-open');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1>SimpleTrack</h1>
        
        <nav className={`main-nav ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            <Link to="/" onClick={closeMenu} className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
            <NavLink to="/exercise-tracker" className={({ isActive }) => isActive ? 'active' : ''}>
              Exercise Tracker
            </NavLink>
            <NavLink to="/macro-calculator" className={({ isActive }) => isActive ? 'active' : ''}>
              Macro Calculator
            </NavLink>
            <Link to="/contact" onClick={closeMenu} className={location.pathname === '/contact' ? 'active' : ''}>
              Contact
            </Link>
          </div>
        </nav>

        <button className="hamburger-menu" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </header>
  );
}

export default Header; 