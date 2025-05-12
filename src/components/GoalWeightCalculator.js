import React, { useState, useEffect } from 'react';
import { useUnit } from '../context/UnitContext';

function GoalWeightCalculator() {
  const [formData, setFormData] = useState({
    currentWeight: '',
    goalWeight: '',
    tdee: '',
    activityLevel: 'moderate'
  });
  const [results, setResults] = useState(null);
  const { isMetric, convertWeight, getWeightUnit } = useUnit();

  useEffect(() => {
    // Get the latest weight from localStorage
    const savedWeight = localStorage.getItem('weightHistory');
    if (savedWeight) {
      const weightHistory = JSON.parse(savedWeight);
      if (weightHistory.length > 0) {
        const latestWeight = weightHistory[weightHistory.length - 1].weight;
        setFormData(prev => ({
          ...prev,
          currentWeight: convertWeight(latestWeight)
        }));
      }
    }
  }, [isMetric]); // Re-run when unit system changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTimeToGoal = (e) => {
    e.preventDefault();
    const { currentWeight, goalWeight, tdee } = formData;

    // Convert weights to kg for calculations
    const currentWeightKg = isMetric ? parseFloat(currentWeight) : parseFloat(currentWeight) / 2.20462;
    const goalWeightKg = isMetric ? parseFloat(goalWeight) : parseFloat(goalWeight) / 2.20462;
    const weightToLose = currentWeightKg - goalWeightKg;

    // Different deficit scenarios (calories per day)
    const scenarios = [
      { name: 'Aggressive', deficit: 1000, description: 'Maximum recommended deficit' },
      { name: 'Moderate', deficit: 750, description: 'Balanced approach' },
      { name: 'Conservative', deficit: 500, description: 'Slow and steady' },
      { name: 'Very Conservative', deficit: 250, description: 'Minimal deficit' }
    ];

    // Calculate time for each scenario
    const results = scenarios.map(scenario => {
      // 7700 calories = 1kg of fat
      const daysToGoal = Math.ceil((weightToLose * 7700) / scenario.deficit);
      const weeksToGoal = Math.ceil(daysToGoal / 7);
      const monthsToGoal = Math.ceil(daysToGoal / 30);
      
      return {
        ...scenario,
        daysToGoal,
        weeksToGoal,
        monthsToGoal,
        dailyCalories: Math.round(parseFloat(tdee) - scenario.deficit)
      };
    });

    setResults({
      weightToLose: weightToLose,
      scenarios: results
    });
  };

  return (
    <div>
      <h2>Goal Weight Calculator</h2>
      <form onSubmit={calculateTimeToGoal}>
        <input
          type="number"
          name="currentWeight"
          value={formData.currentWeight}
          onChange={handleChange}
          placeholder={`Current Weight (${getWeightUnit()})`}
          required
          step="0.1"
        />

        <input
          type="number"
          name="goalWeight"
          value={formData.goalWeight}
          onChange={handleChange}
          placeholder={`Goal Weight (${getWeightUnit()})`}
          required
          step="0.1"
        />

        <input
          type="number"
          name="tdee"
          value={formData.tdee}
          onChange={handleChange}
          placeholder="Your TDEE (calories)"
          required
        />

        <button type="submit">Calculate Time to Goal</button>
      </form>

      {results && (
        <div className="goal-results">
          <h3>Time to Reach Goal Weight</h3>
          <p className="weight-to-lose">
            Weight to lose: {convertWeight(results.weightToLose)} {getWeightUnit()}
          </p>
          
          <div className="scenarios-table">
            <table>
              <thead>
                <tr>
                  <th>Approach</th>
                  <th>Daily Calories</th>
                  <th>Time to Goal</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {results.scenarios.map((scenario, index) => (
                  <tr key={index} className={`scenario-${index + 1}`}>
                    <td>{scenario.name}</td>
                    <td>{scenario.dailyCalories} cal</td>
                    <td>
                      {scenario.monthsToGoal} months
                      <br />
                      ({scenario.weeksToGoal} weeks)
                    </td>
                    <td>{scenario.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="disclaimer">
            <p>* These calculations are estimates based on a caloric deficit. Actual results may vary based on individual factors.</p>
            <p>* It's recommended to consult with a healthcare professional before starting any weight loss program.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoalWeightCalculator; 