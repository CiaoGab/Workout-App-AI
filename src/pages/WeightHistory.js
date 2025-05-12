import React, { useState, useEffect } from 'react';
import { useUnit } from '../context/UnitContext';

function WeightHistory() {
  const [weightHistory, setWeightHistory] = useState([]);
  const [currentWeight, setCurrentWeight] = useState('');
  const { isMetric, convertWeight, getWeightUnit } = useUnit();

  useEffect(() => {
    const savedWeights = localStorage.getItem('weightHistory');
    if (savedWeights) {
      setWeightHistory(JSON.parse(savedWeights));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentWeight) return;

    // Convert weight to kg for storage if in imperial
    const weightInKg = isMetric ? parseFloat(currentWeight) : parseFloat(currentWeight) / 2.20462;

    const newEntry = {
      id: Date.now(),
      weight: weightInKg,
      date: new Date().toLocaleDateString()
    };

    const updatedHistory = [...weightHistory, newEntry];
    setWeightHistory(updatedHistory);
    localStorage.setItem('weightHistory', JSON.stringify(updatedHistory));
    setCurrentWeight('');
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
    <div className="weight-history-page">
      <h2>Weight Tracker</h2>
      
      <div className="weight-form">
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            placeholder={`Enter weight (${getWeightUnit()})`}
            step="0.1"
            required
          />
          <button type="submit">Add Weight</button>
        </form>
      </div>

      <div className="weight-history">
        <h3>Weight History</h3>
        {weightHistory.length > 0 ? (
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
        ) : (
          <p>No weight entries yet. Add your first weight above!</p>
        )}
      </div>
    </div>
  );
}

export default WeightHistory; 