import React from 'react';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} SimpleTrack. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer; 