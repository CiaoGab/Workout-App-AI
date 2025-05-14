import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUnit } from '../context/UnitContext';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isMetric, toggleUnit } = useUnit();

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
            <Link to="/dashboard" onClick={closeMenu} className={location.pathname === '/dashboard' ? 'active' : ''}>
              Dashboard
            </Link>
            <Link to="/contact" onClick={closeMenu} className={location.pathname === '/contact' ? 'active' : ''}>
              Contact
            </Link>
          </div>
          
          <div className="unit-slider-container">
            <span className={`unit-label ${!isMetric ? 'active' : ''}`}>lbs</span>
            <label className="unit-slider">
              <input type="checkbox" checked={isMetric} onChange={toggleUnit} />
              <span className="slider"></span>
            </label>
            <span className={`unit-label ${isMetric ? 'active' : ''}`}>kg</span>
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