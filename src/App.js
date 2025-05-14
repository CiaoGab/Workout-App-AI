import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Onboarding from './components/Onboarding';
import { FitnessPlanProvider } from './context/FitnessPlanContext';

function AppContent() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    const isComplete = localStorage.getItem('onboardingComplete') === 'true';
    setOnboardingComplete(isComplete);
  }, []);

  // Add event listener for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const isComplete = localStorage.getItem('onboardingComplete') === 'true';
      setOnboardingComplete(isComplete);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route 
            path="/dashboard" 
            element={
              onboardingComplete ? (
                <Dashboard />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            } 
          />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <FitnessPlanProvider>
        <AppContent />
      </FitnessPlanProvider>
    </Router>
  );
}

export default App; 