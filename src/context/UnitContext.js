import React, { createContext, useState, useContext } from 'react';

const UnitContext = createContext();

export function UnitProvider({ children }) {
  const [isMetric, setIsMetric] = useState(true);

  const toggleUnit = () => {
    setIsMetric(prev => !prev);
  };

  // Conversion functions
  const convertWeight = (value) => {
    if (isMetric) return Number(value).toFixed(1); // kg
    return (Number(value) * 2.20462).toFixed(1); // to lbs
  };

  const convertHeight = (value) => {
    if (isMetric) return value; // cm
    return (value * 0.393701).toFixed(1); // to inches
  };

  const getWeightUnit = () => isMetric ? 'kg' : 'lbs';
  const getHeightUnit = () => isMetric ? 'cm' : 'in';

  return (
    <UnitContext.Provider value={{
      isMetric,
      toggleUnit,
      convertWeight,
      convertHeight,
      getWeightUnit,
      getHeightUnit
    }}>
      {children}
      <div className="unit-toggle">
        <label className="unit-toggle-label">
          {isMetric ? 'Metric' : 'Imperial'}
        </label>
        <label className="switch">
          <input
            type="checkbox"
            checked={isMetric}
            onChange={toggleUnit}
          />
          <span className="unit-toggle-slider"></span>
        </label>
      </div>
    </UnitContext.Provider>
  );
}

export function useUnit() {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error('useUnit must be used within a UnitProvider');
  }
  return context;
} 