import React, { useState, useEffect } from 'react';
import { useFitnessPlan } from '../context/FitnessPlanContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function MacroCalculator() {
  const { fitnessPlan, updateFitnessPlan } = useFitnessPlan();
  const [macros, setMacros] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [customRatios, setCustomRatios] = useState(null);

  useEffect(() => {
    if (fitnessPlan?.metrics?.macros) {
      setMacros(fitnessPlan.metrics.macros);
    }
  }, [fitnessPlan]);

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

  const handleRatioChange = (macro, value) => {
    if (!customRatios) {
      setCustomRatios({
        protein: macros.protein.percentage,
        carbs: macros.carbs.percentage,
        fat: macros.fat.percentage
      });
    }

    const newRatios = {
      ...customRatios,
      [macro]: value / 100
    };

    // Ensure total equals 1 (100%)
    const total = Object.values(newRatios).reduce((sum, val) => sum + val, 0);
    if (total !== 1) {
      const remaining = 1 - value / 100;
      const otherMacros = Object.keys(newRatios).filter(m => m !== macro);
      const otherTotal = otherMacros.reduce((sum, m) => sum + newRatios[m], 0);
      
      otherMacros.forEach(m => {
        newRatios[m] = (newRatios[m] / otherTotal) * remaining;
      });
    }

    setCustomRatios(newRatios);
  };

  const handleSave = () => {
    if (!customRatios) return;

    const targetCalories = fitnessPlan.metrics.targetCalories;
    const newMacros = {
      protein: {
        calories: Math.round(targetCalories * customRatios.protein),
        percentage: customRatios.protein
      },
      carbs: {
        calories: Math.round(targetCalories * customRatios.carbs),
        percentage: customRatios.carbs
      },
      fat: {
        calories: Math.round(targetCalories * customRatios.fat),
        percentage: customRatios.fat
      }
    };

    // Calculate grams
    newMacros.protein.grams = Math.round(newMacros.protein.calories / 4);
    newMacros.carbs.grams = Math.round(newMacros.carbs.calories / 4);
    newMacros.fat.grams = Math.round(newMacros.fat.calories / 9);

    const updatedPlan = {
      ...fitnessPlan,
      metrics: {
        ...fitnessPlan.metrics,
        macros: newMacros
      }
    };

    updateFitnessPlan(updatedPlan);
    setMacros(newMacros);
    setIsEditing(false);
    setCustomRatios(null);
  };

  if (!macros) return <div>Loading...</div>;

  return (
    <div className="macro-calculator">
      <div className="macro-header">
        <h2>Macro Distribution</h2>
        <button 
          className={`edit-button ${isEditing ? 'active' : ''}`}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Adjust Macros'}
        </button>
      </div>

      <div className="macro-content">
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
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value.toFixed(1)}%`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="macro-details">
          {Object.entries(macros).map(([macro, data]) => (
            <div key={macro} className="macro-item">
              <div className="macro-label">
                <span className="macro-color" style={{ backgroundColor: COLORS[macro] }} />
                <h3>{macro.charAt(0).toUpperCase() + macro.slice(1)}</h3>
              </div>
              <div className="macro-values">
                <p>{data.grams}g</p>
                <p>{data.calories} calories</p>
                <p>{Math.round(data.percentage * 100)}%</p>
              </div>
              {isEditing && (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customRatios ? customRatios[macro] * 100 : data.percentage * 100}
                  onChange={(e) => handleRatioChange(macro, parseFloat(e.target.value))}
                  className="macro-slider"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="macro-actions">
          <button 
            className="save-button"
            onClick={handleSave}
            disabled={!customRatios}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

export default MacroCalculator; 