import React from 'react';
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="main-nav">
      <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
        Dashboard
      </NavLink>
      <NavLink to="/weight-history" className={({ isActive }) => isActive ? 'active' : ''}>
        Weight History
      </NavLink>
      <NavLink to="/exercise-tracker" className={({ isActive }) => isActive ? 'active' : ''}>
        Exercise Tracker
      </NavLink>
    </nav>
  );
}

export default Navigation; 