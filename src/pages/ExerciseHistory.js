import React, { useState, useEffect } from 'react';
import { useUnit } from '../context/UnitContext';

function ExerciseTracker() {
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    notes: ''
  });
  const { isMetric, convertWeight, getWeightUnit } = useUnit();

  useEffect(() => {
    const savedExercises = localStorage.getItem('exercises');
    if (savedExercises) {
      setExercises(JSON.parse(savedExercises));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    // Convert weight to kg for storage if in imperial
    const weightInKg = formData.weight ? (isMetric ? parseFloat(formData.weight) : parseFloat(formData.weight) / 2.20462) : null;

    const newExercise = {
      id: Date.now(),
      ...formData,
      weight: weightInKg,
      date: new Date().toLocaleDateString()
    };

    const updatedExercises = [...exercises, newExercise];
    setExercises(updatedExercises);
    localStorage.setItem('exercises', JSON.stringify(updatedExercises));
    
    // Reset form
    setFormData({
      name: '',
      sets: '',
      reps: '',
      weight: '',
      notes: ''
    });
  };

  const handleDelete = (id) => {
    const updatedExercises = exercises.filter(exercise => exercise.id !== id);
    setExercises(updatedExercises);
    localStorage.setItem('exercises', JSON.stringify(updatedExercises));
  };

  return (
    <div className="exercise-tracker-page">
      <h2>Exercise Tracker</h2>
      
      <div className="exercise-form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Exercise Name"
            required
          />
          <input
            type="number"
            name="sets"
            value={formData.sets}
            onChange={handleChange}
            placeholder="Number of Sets"
            required
          />
          <input
            type="number"
            name="reps"
            value={formData.reps}
            onChange={handleChange}
            placeholder="Number of Reps"
            required
          />
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder={`Weight (${getWeightUnit()})`}
            step="0.1"
          />
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes (optional)"
          />
          <button type="submit">Add Exercise</button>
        </form>
      </div>

      <div className="exercise-history">
        <h3>Exercise History</h3>
        {exercises.length > 0 ? (
          <div className="exercises-list">
            <table>
              <thead>
                <tr>
                  <th>Exercise</th>
                  <th>Sets</th>
                  <th>Reps</th>
                  <th>Weight</th>
                  <th>Notes</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exercises.slice().reverse().map(exercise => (
                  <tr key={exercise.id}>
                    <td>{exercise.name}</td>
                    <td>{exercise.sets}</td>
                    <td>{exercise.reps}</td>
                    <td>{exercise.weight ? `${convertWeight(exercise.weight)} ${getWeightUnit()}` : '-'}</td>
                    <td>{exercise.notes}</td>
                    <td>{exercise.date}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(exercise.id)}
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
          <p>No exercises recorded yet. Add your first exercise above!</p>
        )}
      </div>
    </div>
  );
}

export default ExerciseTracker; 