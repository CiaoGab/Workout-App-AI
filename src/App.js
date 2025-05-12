import React from 'react';
import './App.css';
import WeightTracker from './components/WeightTracker';
import HeartRateZones from './components/HeartRateZones';
import TDEECalculator from './components/TDEECalculator';
import ExerciseTracker from './components/ExerciseTracker';
import GoalWeightCalculator from './components/GoalWeightCalculator';
import { UnitProvider } from './context/UnitContext';

function AppContent() {
  return (
    <div className="app">
      <header>
        <h1>Fitness Journal</h1>
      </header>
      <main className="grid-container">
        <div className="tdee-calculator">
          <TDEECalculator />
        </div>
        <div className="weight-tracker">
          <WeightTracker />
        </div>
        <div className="goal-weight-calculator">
          <GoalWeightCalculator />
        </div>
        <div className="heart-rate-zones">
          <HeartRateZones />
        </div>
        <div className="exercise-tracker">
          <ExerciseTracker />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <UnitProvider>
      <AppContent />
    </UnitProvider>
  );
}

export default App; 