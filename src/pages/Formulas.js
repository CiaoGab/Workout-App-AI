import React from 'react';
import TDEECalculator from '../components/TDEECalculator';
import HeartRateZones from '../components/HeartRateZones';
import GoalWeightCalculator from '../components/GoalWeightCalculator';

function Formulas() {
  return (
    <div className="formulas-page">
      <h2>Fitness Calculators</h2>
      <p className="formulas-intro">Use these calculators to help plan and track your fitness journey.</p>
      
      <div className="formulas-grid">
        <div className="formula-card">
          <TDEECalculator />
        </div>
        <div className="formula-card">
          <GoalWeightCalculator />
        </div>
        <div className="formula-card">
          <HeartRateZones />
        </div>
      </div>
    </div>
  );
}

export default Formulas; 