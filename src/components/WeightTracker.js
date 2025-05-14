import React, { useState, useEffect } from 'react';

function WeightTracker() {
  const [weight, setWeight] = useState('');
  const [weightHistory, setWeightHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('weightHistory');
    if (savedHistory) {
      setWeightHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(weight)
    };
    
    const updatedHistory = [...weightHistory, newEntry].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    setWeightHistory(updatedHistory);
    localStorage.setItem('weightHistory', JSON.stringify(updatedHistory));
    setWeight('');
  };

  const handleDelete = (date) => {
    const updatedHistory = weightHistory.filter(entry => entry.date !== date);
    setWeightHistory(updatedHistory);
    localStorage.setItem('weightHistory', JSON.stringify(updatedHistory));
  };

  return (
    <div className="weight-tracker">
      <h2>Weight Tracker</h2>
      <form onSubmit={handleSubmit} className="weight-form">
        <div className="form-group">
          <label htmlFor="weight">Current Weight (lbs)</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            step="0.1"
            min="50"
            max="500"
            required
          />
        </div>
        <button type="submit">Add Weight</button>
      </form>

      {weightHistory.length > 0 && (
        <div className="weight-history">
          <h3>Weight History</h3>
          <table className="weight-history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight (lbs)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {weightHistory.map((entry) => (
                <tr key={entry.date}>
                  <td>{entry.date}</td>
                  <td>{entry.weight}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(entry.date)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default WeightTracker; 