import React, { useState, useEffect } from 'react';
import { useUnit } from '../context/UnitContext';

function WeightTracker() {
  const [weight, setWeight] = useState('');
  const [weightHistory, setWeightHistory] = useState([]);
  const { isMetric, convertWeight, getWeightUnit } = useUnit();

  useEffect(() => {
    const savedWeight = localStorage.getItem('weightHistory');
    if (savedWeight) {
      setWeightHistory(JSON.parse(savedWeight));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight) return;

    // Convert to metric for storage if in imperial
    const weightInKg = isMetric ? parseFloat(weight) : parseFloat(weight) / 2.20462;

    const newEntry = {
      id: Date.now(),
      weight: weightInKg,
      date: new Date().toLocaleDateString()
    };

    const updatedHistory = [...weightHistory, newEntry];
    setWeightHistory(updatedHistory);
    localStorage.setItem('weightHistory', JSON.stringify(updatedHistory));
    setWeight('');
  };

  const handleDelete = (id) => {
    const updatedHistory = weightHistory.filter(entry => entry.id !== id);
    setWeightHistory(updatedHistory);
    localStorage.setItem('weightHistory', JSON.stringify(updatedHistory));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <h2>Weight Tracker</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder={`Enter weight (${getWeightUnit()})`}
          required
        />
        <button type="submit">Add Weight</button>
      </form>
      
      {weightHistory.length > 0 && (
        <div className="weight-history">
          <h3>Latest Weight: {convertWeight(weightHistory[weightHistory.length - 1].weight)} {getWeightUnit()}</h3>
          <p>Last updated: {formatDate(weightHistory[weightHistory.length - 1].date)}</p>
          
          <div className="weight-history-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {weightHistory.slice().reverse().map(entry => (
                  <tr key={entry.id}>
                    <td>{formatDate(entry.date)}</td>
                    <td>{convertWeight(entry.weight)} {getWeightUnit()}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
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

export default WeightTracker; 