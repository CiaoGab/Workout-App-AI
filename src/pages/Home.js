import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1>Welcome to SimpleTrack</h1>
        <p>Your personal fitness journey starts here</p>
        <button onClick={handleGetStarted} className="cta-button">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home; 