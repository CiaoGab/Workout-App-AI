import React, { useState } from 'react';

function GoalWeightCalculator() {
  const [formData, setFormData] = useState({
    currentWeight: '',
    goalWeight: '',
    timeframe: '12'
  });

  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateGoal = (e) => {
    e.preventDefault();
    const { currentWeight, goalWeight, timeframe } = formData;
    
    const weightDiff = parseFloat(goalWeight) - parseFloat(currentWeight);
    const weeklyChange = weightDiff / (parseInt(timeframe) / 4);
    const dailyCalorieAdjustment = Math.round(weeklyChange * 500); // 500 calories ≈ 1 lb per week

    setResults({
      weeklyChange: weeklyChange.toFixed(1),
      dailyCalorieAdjustment,
      isWeightLoss: weightDiff < 0
    });
  };

  return (
    <div className="goal-weight-calculator">
      <h2>Goal Weight Calculator</h2>
      <form onSubmit={calculateGoal} className="goal-form">
        <div className="form-group">
          <label htmlFor="currentWeight">Current Weight (lbs)</label>
          <input
            type="number"
            id="currentWeight"
            name="currentWeight"
            value={formData.currentWeight}
            onChange={handleChange}
            min="50"
            max="500"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="goalWeight">Goal Weight (lbs)</label>
          <input
            type="number"
            id="goalWeight"
            name="goalWeight"
            value={formData.goalWeight}
            onChange={handleChange}
            min="50"
            max="500"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="timeframe">Timeframe (weeks)</label>
          <select
            id="timeframe"
            name="timeframe"
            value={formData.timeframe}
            onChange={handleChange}
            required
          >
            <option value="4">4 weeks</option>
            <option value="8">8 weeks</option>
            <option value="12">12 weeks</option>
            <option value="16">16 weeks</option>
            <option value="24">24 weeks</option>
          </select>
        </div>

        <button type="submit">Calculate Plan</button>
      </form>

      {results && (
        <div className="goal-results">
          <h3>Your Plan</h3>
          <p>Weekly {results.isWeightLoss ? 'Weight Loss' : 'Weight Gain'}: {Math.abs(results.weeklyChange)} lbs</p>
          <p>Daily Calorie {results.isWeightLoss ? 'Deficit' : 'Surplus'}: {Math.abs(results.dailyCalorieAdjustment)} calories</p>
          <p className="note">
            Note: For healthy and sustainable results, aim for 0.5-1 lb of {results.isWeightLoss ? 'weight loss' : 'weight gain'} per week.
            {Math.abs(results.weeklyChange) > 1 && ' Your current plan may be too aggressive.'}
          </p>
        </div>
      )}
    </div>
  );
}

export default GoalWeightCalculator; 