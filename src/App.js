import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import WeightHistory from './pages/WeightHistory';
import ExerciseTracker from './pages/ExerciseHistory';
import WeightTracker from './components/WeightTracker';
import HeartRateZones from './components/HeartRateZones';
import TDEECalculator from './components/TDEECalculator';
import GoalWeightCalculator from './components/GoalWeightCalculator';
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
          <Route path="/" element={<Dashboard />} />
          <Route path="/weight-history" element={<WeightHistory />} />
          <Route path="/exercise-tracker" element={<ExerciseTracker />} />
        </Routes>
      </main>
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