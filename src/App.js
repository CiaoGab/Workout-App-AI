import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import WeightHistory from './pages/WeightHistory';
import ExerciseTracker from './pages/ExerciseHistory';
import Formulas from './pages/Formulas';
import { UnitProvider } from './context/UnitContext';

function AppContent() {
  return (
    <div className="app">
      <header>
        <h1>Fitness Journal</h1>
        <Navigation />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/weight-history" element={<WeightHistory />} />
          <Route path="/exercise-tracker" element={<ExerciseTracker />} />
          <Route path="/formulas" element={<Formulas />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <UnitProvider>
        <AppContent />
      </UnitProvider>
    </Router>
  );
}

export default App; 