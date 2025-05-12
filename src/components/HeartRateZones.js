import React, { useState } from 'react';

function HeartRateZones() {
  const [formData, setFormData] = useState({
    age: '',
    restingHR: '',
    maxHR: '',
    calculationMethod: 'basic' // 'basic', 'karvonen', 'custom'
  });
  const [zones, setZones] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateZones = (e) => {
    e.preventDefault();
    const { age, restingHR, maxHR, calculationMethod } = formData;

    let calculatedMaxHR;
    if (calculationMethod === 'custom') {
      calculatedMaxHR = parseFloat(maxHR);
    } else {
      calculatedMaxHR = 220 - parseInt(age);
    }

    const hrReserve = calculatedMaxHR - parseInt(restingHR);

    const calculatedZones = {
      maxHR: calculatedMaxHR,
      zones: [
        {
          name: "VO2 Max Zone",
          range: "90% - 100%",
          min: Math.round(calculatedMaxHR * 0.9),
          max: Math.round(calculatedMaxHR * 1.0),
          description: "Maximum effort, short duration"
        },
        {
          name: "Anaerobic Zone",
          range: "80% - 90%",
          min: Math.round(calculatedMaxHR * 0.8),
          max: Math.round(calculatedMaxHR * 0.9),
          description: "High intensity, short duration"
        },
        {
          name: "Aerobic Zone",
          range: "70% - 80%",
          min: Math.round(calculatedMaxHR * 0.7),
          max: Math.round(calculatedMaxHR * 0.8),
          description: "Moderate intensity, longer duration"
        },
        {
          name: "Fat Burn Zone",
          range: "60% - 70%",
          min: Math.round(calculatedMaxHR * 0.6),
          max: Math.round(calculatedMaxHR * 0.7),
          description: "Light to moderate intensity"
        },
        {
          name: "Warm Up Zone",
          range: "50% - 60%",
          min: Math.round(calculatedMaxHR * 0.5),
          max: Math.round(calculatedMaxHR * 0.6),
          description: "Very light intensity"
        }
      ]
    };

    if (calculationMethod === 'karvonen') {
      calculatedZones.zones = calculatedZones.zones.map(zone => ({
        ...zone,
        min: Math.round((hrReserve * (parseFloat(zone.range.split('%')[0]) / 100)) + parseInt(restingHR)),
        max: Math.round((hrReserve * (parseFloat(zone.range.split('%')[1]) / 100)) + parseInt(restingHR))
      }));
    }

    setZones(calculatedZones);
  };

  return (
    <div>
      <h2>Heart Rate Zones</h2>
      <form onSubmit={calculateZones}>
        <select 
          name="calculationMethod" 
          value={formData.calculationMethod} 
          onChange={handleChange}
        >
          <option value="basic">Basic (Age-based)</option>
          <option value="karvonen">Karvonen (Age & Resting HR)</option>
          <option value="custom">Custom (Enter Max HR)</option>
        </select>

        {formData.calculationMethod !== 'custom' && (
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            required
          />
        )}

        {formData.calculationMethod === 'karvonen' && (
          <input
            type="number"
            name="restingHR"
            value={formData.restingHR}
            onChange={handleChange}
            placeholder="Resting Heart Rate"
            required
          />
        )}

        {formData.calculationMethod === 'custom' && (
          <input
            type="number"
            name="maxHR"
            value={formData.maxHR}
            onChange={handleChange}
            placeholder="Maximum Heart Rate"
            required
          />
        )}

        <button type="submit">Calculate Zones</button>
      </form>

      {zones && (
        <div className="zones-display">
          <h3>Your Heart Rate Zones:</h3>
          <p className="max-hr">Maximum Heart Rate: {zones.maxHR} bpm</p>
          <div className="zones-table">
            <table>
              <thead>
                <tr>
                  <th>Zone</th>
                  <th>Intensity</th>
                  <th>Heart Rate Range</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {zones.zones.map((zone, index) => (
                  <tr key={index} className={`zone-${index + 1}`}>
                    <td>{zone.name}</td>
                    <td>{zone.range}</td>
                    <td>{zone.min} - {zone.max} bpm</td>
                    <td>{zone.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeartRateZones; 