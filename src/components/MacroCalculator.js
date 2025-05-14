import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import '../styles/MacroCalculator.css';

function MacroCalculator() {
  const defaultFormData = {
    weight: '', // in pounds
    heightFeet: '',
    heightInches: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintenance',
    formula: 'mifflin', // mifflin or katch
    bodyFatPercentage: '', // for Katch-McArdle
    macroPreset: 'balanced', // balanced, lowFat, lowCarb, highProtein, custom
    proteinPercentage: 40,
    carbsPercentage: 40,
    fatPercentage: 20
  };

  const [formData, setFormData] = useState(() => {
    // Load saved data from localStorage on initial render
    const savedData = localStorage.getItem('macroCalculatorData');
    return savedData ? JSON.parse(savedData) : defaultFormData;
  });

  const [macros, setMacros] = useState(null);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('macroCalculatorData', JSON.stringify(formData));
  }, [formData]);

  const activityMultipliers = {
    sedentary: 1.2, // Little or no exercise
    light: 1.375, // Light exercise 1-3 times/week
    moderate: 1.55, // Moderate exercise 3-5 times/week
    active: 1.725, // Hard exercise 6-7 times/week
    veryActive: 1.9 // Very hard exercise & physical job or training twice per day
  };

  const goalAdjustments = {
    extremeLoss: -1000, // 2 lbs per week
    weightLoss: -500, // 1 lb per week
    mildLoss: -250, // 0.5 lb per week
    maintenance: 0,
    mildGain: 250, // 0.5 lb per week
    weightGain: 500, // 1 lb per week
    extremeGain: 1000 // 2 lbs per week
  };

  const macroPresets = {
    balanced: { protein: 30, carbs: 40, fat: 30 },
    lowFat: { protein: 40, carbs: 50, fat: 10 },
    lowCarb: { protein: 40, carbs: 10, fat: 50 },
    highProtein: { protein: 50, carbs: 30, fat: 20 }
  };

  const calculateBMR = () => {
    const { weight, heightFeet, heightInches, age, gender, formula, bodyFatPercentage } = formData;
    
    if (formula === 'katch' && !bodyFatPercentage) {
      return null; // Can't calculate without body fat percentage
    }

    // Convert height to centimeters
    const heightInInches = (parseInt(heightFeet) * 12) + parseInt(heightInches);
    const heightInCm = heightInInches * 2.54;
    
    // Convert weight to kilograms
    const weightInKg = weight * 0.453592;
    
    if (formula === 'katch') {
      // Katch-McArdle Formula
      const leanBodyMass = weightInKg * (1 - (parseFloat(bodyFatPercentage) / 100));
      return 370 + (21.6 * leanBodyMass);
    } else {
      // Mifflin-St Jeor Equation
      let bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age;
      bmr = gender === 'male' ? bmr + 5 : bmr - 161;
      return bmr;
    }
  };

  const calculateTDEE = (bmr) => {
    return bmr * activityMultipliers[formData.activityLevel];
  };

  const calculateTargetCalories = (tdee) => {
    return tdee + goalAdjustments[formData.goal];
  };

  const calculateMacros = (calories) => {
    let proteinRatio, carbsRatio, fatRatio;

    if (formData.macroPreset === 'custom') {
      proteinRatio = formData.proteinPercentage / 100;
      carbsRatio = formData.carbsPercentage / 100;
      fatRatio = formData.fatPercentage / 100;
    } else {
      const preset = macroPresets[formData.macroPreset];
      proteinRatio = preset.protein / 100;
      carbsRatio = preset.carbs / 100;
      fatRatio = preset.fat / 100;
    }

    const proteinGrams = Math.round((calories * proteinRatio) / 4);
    const carbsGrams = Math.round((calories * carbsRatio) / 4);
    const fatGrams = Math.round((calories * fatRatio) / 9);

    // Calculate sugar and saturated fat recommendations
    const sugarGrams = Math.round(carbsGrams * 0.2); // 20% of carbs as sugar
    const saturatedFatGrams = Math.round(fatGrams * 0.4); // 40% of fat as saturated

    return {
      protein: {
        calories: Math.round(calories * proteinRatio),
        percentage: proteinRatio,
        grams: proteinGrams
      },
      carbs: {
        calories: Math.round(calories * carbsRatio),
        percentage: carbsRatio,
        grams: carbsGrams,
        sugar: sugarGrams
      },
      fat: {
        calories: Math.round(calories * fatRatio),
        percentage: fatRatio,
        grams: fatGrams,
        saturated: saturatedFatGrams
      }
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'macroPreset' && value !== 'custom') {
      const preset = macroPresets[value];
      setFormData(prev => ({
        ...prev,
        [name]: value,
        proteinPercentage: preset.protein,
        carbsPercentage: preset.carbs,
        fatPercentage: preset.fat
      }));
    } else if (name.includes('Percentage')) {
      const numValue = parseInt(value) || 0;
      const otherMacros = ['proteinPercentage', 'carbsPercentage', 'fatPercentage'].filter(
        macro => macro !== name
      );
      const otherValues = otherMacros.reduce((sum, macro) => 
        sum + (parseInt(formData[macro]) || 0), 0
      );
      
      if (numValue + otherValues <= 100) {
        setFormData(prev => ({
          ...prev,
          [name]: numValue,
          macroPreset: 'custom'
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleReset = () => {
    setFormData(defaultFormData);
    setMacros(null);
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const bmr = calculateBMR();
    if (bmr === null) {
      alert('Please enter body fat percentage for Katch-McArdle formula');
      return;
    }
    const tdee = calculateTDEE(bmr);
    const targetCalories = calculateTargetCalories(tdee);
    const calculatedMacros = calculateMacros(targetCalories);
    setMacros(calculatedMacros);
  };

  const COLORS = {
    protein: '#FF6B6B',
    carbs: '#4ECDC4',
    fat: '#FFD93D'
  };

  const chartData = macros ? [
    { name: 'Protein', value: macros.protein.percentage * 100, color: COLORS.protein },
    { name: 'Carbs', value: macros.carbs.percentage * 100, color: COLORS.carbs },
    { name: 'Fat', value: macros.fat.percentage * 100, color: COLORS.fat }
  ] : [];

  const totalCalories = macros ? 
    macros.protein.calories + macros.carbs.calories + macros.fat.calories : 0;

  return (
    <div className="macro-calculator">
      <div className="macro-calculator-container">
        <h2>Macro Calculator</h2>

        <form onSubmit={handleCalculate} className="macro-form">
          <div className="form-group">
            <label htmlFor="weight">Weight (lbs)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              required
              min="50"
              max="500"
              step="0.1"
            />
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
              min="15"
              max="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="formula">BMR Formula</label>
            <select
              id="formula"
              name="formula"
              value={formData.formula}
              onChange={handleInputChange}
            >
              <option value="mifflin">Mifflin-St Jeor</option>
              <option value="katch">Katch-McArdle</option>
            </select>
          </div>

          {formData.formula === 'katch' && (
            <div className="form-group">
              <label htmlFor="bodyFatPercentage">Body Fat Percentage</label>
              <input
                type="number"
                id="bodyFatPercentage"
                name="bodyFatPercentage"
                value={formData.bodyFatPercentage}
                onChange={handleInputChange}
                required
                min="3"
                max="60"
                step="0.1"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="activityLevel">Activity Level</label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleInputChange}
            >
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light">Light (1-3 days/week)</option>
              <option value="moderate">Moderate (3-5 days/week)</option>
              <option value="active">Active (6-7 days/week)</option>
              <option value="veryActive">Very Active (2x per day)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="goal">Goal</label>
            <select
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
            >
              <option value="extremeLoss">Extreme Weight Loss (2 lbs/week)</option>
              <option value="weightLoss">Weight Loss (1 lb/week)</option>
              <option value="mildLoss">Mild Weight Loss (0.5 lb/week)</option>
              <option value="maintenance">Maintenance</option>
              <option value="mildGain">Mild Weight Gain (0.5 lb/week)</option>
              <option value="weightGain">Weight Gain (1 lb/week)</option>
              <option value="extremeGain">Extreme Weight Gain (2 lbs/week)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="macroPreset">Macro Distribution</label>
            <select
              id="macroPreset"
              name="macroPreset"
              value={formData.macroPreset}
              onChange={handleInputChange}
            >
              <option value="balanced">Balanced (30/40/30)</option>
              <option value="lowFat">Low Fat (40/50/10)</option>
              <option value="lowCarb">Low Carb (40/10/50)</option>
              <option value="highProtein">High Protein (50/30/20)</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {formData.macroPreset === 'custom' && (
            <div className="form-group">
              <label>Custom Macro Distribution (%)</label>
              <div className="macro-inputs">
                <div className="macro-input">
                  <input
                    type="number"
                    id="proteinPercentage"
                    name="proteinPercentage"
                    value={formData.proteinPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    required
                  />
                  <span>Protein</span>
                </div>
                <div className="macro-input">
                  <input
                    type="number"
                    id="carbsPercentage"
                    name="carbsPercentage"
                    value={formData.carbsPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    required
                  />
                  <span>Carbs</span>
                </div>
                <div className="macro-input">
                  <input
                    type="number"
                    id="fatPercentage"
                    name="fatPercentage"
                    value={formData.fatPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    required
                  />
                  <span>Fat</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-buttons">
            <button type="submit" className="calculate-button">Calculate Macros</button>
            <button type="button" className="reset-button" onClick={handleReset}>Reset</button>
          </div>
        </form>

        {macros && (
          <div className="macro-results">
            <div className="total-calories">
              <h3>Daily Calorie Target</h3>
              <div className="total-calories-value">{totalCalories}</div>
              <div className="total-calories-unit">calories</div>
            </div>
            
            <div className="macro-chart">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1000}
                    animationBegin={0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="#1a1a1a"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value.toFixed(1)}%`}
                    contentStyle={{
                      backgroundColor: '#2d2d2d',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      padding: '10px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => (
                      <span style={{ color: '#ffffff', fontSize: '14px' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="macro-cards">
              {Object.entries(macros).map(([macro, data]) => (
                <div key={macro} className="macro-card">
                  <h3>{macro.charAt(0).toUpperCase() + macro.slice(1)}</h3>
                  <div className="macro-value">{data.grams}g</div>
                  <div className="macro-unit">Grams</div>
                  <div className="macro-value">{data.calories}</div>
                  <div className="macro-unit">Calories</div>
                  <div className="macro-value">{Math.round(data.percentage * 100)}%</div>
                  <div className="macro-unit">of total</div>
                  {macro === 'carbs' && (
                    <>
                      <div className="macro-value">{data.sugar}g</div>
                      <div className="macro-unit">Sugar</div>
                    </>
                  )}
                  {macro === 'fat' && (
                    <>
                      <div className="macro-value">{data.saturated}g</div>
                      <div className="macro-unit">Saturated Fat</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="macro-info">
          <h3>Macro Guidelines</h3>
          <ul>
            <li>
              <strong>Protein:</strong> Essential for muscle maintenance and growth
              <br />
              <span className="guideline-note">Aim for 0.8-1g per pound of bodyweight</span>
            </li>
            <li>
              <strong>Carbohydrates:</strong> Primary energy source for workouts
              <br />
              <span className="guideline-note">Adjust based on activity level and goals</span>
            </li>
            <li>
              <strong>Fats:</strong> Important for hormone production and nutrient absorption
              <br />
              <span className="guideline-note">Minimum 20% of total calories</span>
            </li>
          </ul>
          <p className="note">
            These calculations are based on the {formData.formula === 'mifflin' ? 'Mifflin-St Jeor' : 'Katch-McArdle'} Equation and general macro guidelines.
            Adjust as needed based on your progress and how your body responds.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MacroCalculator; 