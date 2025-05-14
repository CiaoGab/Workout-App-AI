import React from 'react';
import WeightTracker from '../components/WeightTracker';
import ExerciseTracker from '../components/ExerciseTracker';
import TDEECalculator from '../components/TDEECalculator';
import GoalWeightCalculator from '../components/GoalWeightCalculator';
import HeartRateZones from '../components/HeartRateZones';

function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Fitness Dashboard</h2>
      
      <div className="dashboard-grid">
        {/* Weight Tracking Section */}
        <div className="dashboard-card">
          <WeightTracker />
        </div>

        {/* Exercise Tracking Section */}
        <div className="dashboard-card">
          <ExerciseTracker />
        </div>

        {/* Calculators Section */}
        <div className="dashboard-card">
          <TDEECalculator />
        </div>

        <div className="dashboard-card">
          <GoalWeightCalculator />
        </div>

        {/* Heart Rate Zones Section */}
        <div className="dashboard-card">
          <HeartRateZones />
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 