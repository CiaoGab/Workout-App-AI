import React, { useState } from 'react';

function TDEECalculator() {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    heightFeet: '',
    heightInches: '',
    weight: '',
    activityLevel: ''
  });

  const [tdee, setTdee] = useState(null);

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)', multiplier: 1.2 },
    { value: 'light', label: 'Lightly Active (light exercise 1-3 days/week)', multiplier: 1.375 },
    { value: 'moderate', label: 'Moderately Active (moderate exercise 3-5 days/week)', multiplier: 1.55 },
    { value: 'active', label: 'Very Active (hard exercise 6-7 days/week)', multiplier: 1.725 },
    { value: 'very_active', label: 'Extremely Active (very hard exercise & physical job)', multiplier: 1.9 }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTDEE = (e) => {
    e.preventDefault();
    
    // Convert height to inches
    const heightInInches = (parseInt(formData.heightFeet) * 12) + parseInt(formData.heightInches);
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (formData.gender === 'male') {
      bmr = (10 * formData.weight) + (6.25 * heightInInches) - (5 * formData.age) + 5;
    } else {
      bmr = (10 * formData.weight) + (6.25 * heightInInches) - (5 * formData.age) - 161;
    }

    // Find activity multiplier
    const activity = activityLevels.find(level => level.value === formData.activityLevel);
    const tdee = Math.round(bmr * activity.multiplier);

    setTdee({
      bmr: Math.round(bmr),
      tdee: tdee,
      deficit: Math.round(tdee - 500),
      surplus: Math.round(tdee + 500)
    });
  };

  return (
    <div className="tdee-calculator">
      <h2>TDEE Calculator</h2>
      <form onSubmit={calculateTDEE} className="tdee-form">
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="16"
            max="100"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="height">Height</label>
          <div className="height-inputs">
            <div className="height-input">
              <input
                type="number"
                id="heightFeet"
                name="heightFeet"
                value={formData.heightFeet}
                onChange={handleChange}
                min="4"
                max="7"
                placeholder="Feet"
                required
              />
              <span>ft</span>
            </div>
            <div className="height-input">
              <input
                type="number"
                id="heightInches"
                name="heightInches"
                value={formData.heightInches}
                onChange={handleChange}
                min="0"
                max="11"
                placeholder="Inches"
                required
              />
              <span>in</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight (lbs)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            min="50"
            max="500"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="activityLevel">Activity Level</label>
          <select
            id="activityLevel"
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
            required
          >
            <option value="">Select activity level</option>
            {activityLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Calculate TDEE</button>
      </form>

      {tdee && (
        <div className="tdee-result">
          <h3>Your Results</h3>
          <p>Basal Metabolic Rate (BMR): {tdee.bmr} calories/day</p>
          <p>Total Daily Energy Expenditure (TDEE): {tdee.tdee} calories/day</p>
          <p>For Weight Loss: {tdee.deficit} calories/day</p>
          <p>For Weight Gain: {tdee.surplus} calories/day</p>
        </div>
      )}
    </div>
  );
}

export default TDEECalculator; 