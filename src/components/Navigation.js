import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useUnit } from '../context/UnitContext';
import { useLocation } from 'react-router-dom';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMetric, toggleUnit } = useUnit();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isMenuOpen]);

  const renderUnitToggle = () => {
    return (
      <div className="unit-slider-container">
        <span className={`unit-label ${isMetric ? 'active' : ''}`}>Metric</span>
        <label className="unit-slider">
          <input 
            type="checkbox" 
            checked={!isMetric} 
            onChange={toggleUnit}
          />
          <span className="slider"></span>
        </label>
        <span className={`unit-label ${!isMetric ? 'active' : ''}`}>Imperial</span>
      </div>
    );
  };

  return (
    <>
      <button 
        className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div 
        className={`nav-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={closeMenu}
      />

      <nav className={`main-nav ${isMenuOpen ? 'active' : ''}`}>
        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
        {renderUnitToggle()}
      </nav>
    </>
  );
}

export default Navigation; 