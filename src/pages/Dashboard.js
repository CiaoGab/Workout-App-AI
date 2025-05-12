import React from 'react';
import TDEECalculator from '../components/TDEECalculator';
import HeartRateZones from '../components/HeartRateZones';
import GoalWeightCalculator from '../components/GoalWeightCalculator';

function Dashboard() {
  return (
    <div className="grid-container">
      <div className="tdee-calculator">
        <TDEECalculator />
      </div>
      <div className="goal-weight-calculator">
        <GoalWeightCalculator />
      </div>
      <div className="heart-rate-zones">
        <HeartRateZones />
      </div>
    </div>
  );
}

export default Dashboard; 