import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1>Welcome to SimpleTrack</h1>
        <p className="subtitle">Your comprehensive fitness tracking companion</p>
      </div>

      <div className="cta-section">
        <h2>Ready to Start Your Fitness Journey?</h2>
        <p>Begin tracking your progress today and achieve your fitness goals.</p>
        <Link to="/weight-history" className="cta-button">Get Started</Link>
      </div>
    </div>
  );
}

export default Landing; 