import React from 'react';
import Navigation from './Navigation';

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>SimpleTrack</h1>
        <Navigation />
      </div>
    </header>
  );
}

export default Header; 