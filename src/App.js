import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import WeightHistory from './pages/WeightHistory';
import ExerciseTracker from './pages/ExerciseHistory';
import Formulas from './pages/Formulas';
import Contact from './pages/Contact';
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
          <Route path="/Workout-App-AI" element={<Landing />} />
          <Route path="/Workout-App-AI/weight-history" element={<WeightHistory />} />
          <Route path="/Workout-App-AI/exercise-tracker" element={<ExerciseTracker />} />
          <Route path="/Workout-App-AI/formulas" element={<Formulas />} />
          <Route path="/Workout-App-AI/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router basename="/Workout-App-AI">
      <UnitProvider>
        <AppContent />
      </UnitProvider>
    </Router>
  );
}

export default App; 