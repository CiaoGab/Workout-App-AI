import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1>Welcome to Fitness Journal</h1>
        <p className="subtitle">Your comprehensive fitness tracking companion</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3>Weight Tracking</h3>
          <p>Track your weight progress over time with detailed history and trends.</p>
          <Link to="/weight-history" className="feature-link">Start Tracking</Link>
        </div>

        <div className="feature-card">
          <h3>Exercise Log</h3>
          <p>Record your workouts, track sets, reps, and weights for each exercise.</p>
          <Link to="/exercise-tracker" className="feature-link">Log Exercise</Link>
        </div>

        <div className="feature-card">
          <h3>Fitness Calculators</h3>
          <p>Access TDEE, heart rate zones, and goal weight calculators.</p>
          <Link to="/formulas" className="feature-link">View Calculators</Link>
        </div>
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