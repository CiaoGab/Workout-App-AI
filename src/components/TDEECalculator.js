import React, { useState } from 'react';
import { useUnit } from '../context/UnitContext';

function TDEECalculator() {
  const [formData, setFormData] = useState({
    sex: 'male',
    weight: '',
    height: '',
    age: '',
    activityLevel: 'moderate'
  });
  const [tdee, setTdee] = useState(null);
  const { isMetric, convertWeight, convertHeight, getWeightUnit, getHeightUnit } = useUnit();

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };

  const calculateTDEE = (e) => {
    e.preventDefault();
    const { sex, weight, height, age, activityLevel } = formData;
    
    // Convert to metric for calculations
    const weightInKg = isMetric ? parseFloat(weight) : parseFloat(weight) / 2.20462;
    const heightInCm = isMetric ? parseFloat(height) : parseFloat(height) * 2.54;
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (sex === 'male') {
      bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + 5;
    } else {
      bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
    }

    // Calculate TDEE
    const calculatedTDEE = Math.round(bmr * activityMultipliers[activityLevel]);
    setTdee(calculatedTDEE);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h2>TDEE Calculator</h2>
      <form onSubmit={calculateTDEE}>
        <select name="sex" value={formData.sex} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          placeholder={`Weight (${getWeightUnit()})`}
          required
        />

        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
          placeholder={`Height (${getHeightUnit()})`}
          required
        />

        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          required
        />

        <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
          <option value="sedentary">Sedentary (little or no exercise)</option>
          <option value="light">Lightly active (light exercise 1-3 days/week)</option>
          <option value="moderate">Moderately active (moderate exercise 3-5 days/week)</option>
          <option value="active">Very active (hard exercise 6-7 days/week)</option>
          <option value="veryActive">Extra active (very hard exercise & physical job)</option>
        </select>

        <button type="submit">Calculate TDEE</button>
      </form>

      {tdee && (
        <div className="tdee-result">
          <h3>Your Daily Calorie Needs:</h3>
          <p>Maintenance: {tdee} calories/day</p>
          <p>Weight Loss: {tdee - 500} calories/day</p>
          <p>Weight Gain: {tdee + 500} calories/day</p>
        </div>
      )}
    </div>
  );
}

export default TDEECalculator; 