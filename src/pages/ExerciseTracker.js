import React, { useState, useEffect } from 'react';
import { useFitnessPlan } from '../context/FitnessPlanContext';
import '../styles/ExerciseTracker.css';

const ExerciseTracker = () => {
  const { fitnessPlan, updateFitnessPlan } = useFitnessPlan();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    exerciseName: '',
    sets: '',
    reps: '',
    weight: '',
    intensity: 5,
    notes: ''
  });

  useEffect(() => {
    // Load existing exercises from fitness plan
    if (fitnessPlan?.exercises) {
      // Sort exercises by date
      const sortedExercises = [...fitnessPlan.exercises].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      updateFitnessPlan({ ...fitnessPlan, exercises: sortedExercises });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new date object and adjust for timezone offset
    const selectedDate = new Date(formData.date + 'T00:00:00');
    const adjustedDate = new Date(selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000);
    const formattedDate = adjustedDate.toISOString().split('T')[0];
    
    const newExercise = {
      id: Date.now(),
      ...formData,
      date: formattedDate // Use the timezone-adjusted date
    };

    const updatedExercises = [...(fitnessPlan?.exercises || []), newExercise];
    
    // Sort exercises by date
    const sortedExercises = updatedExercises.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    updateFitnessPlan({
      ...fitnessPlan,
      exercises: sortedExercises
    });

    // Reset form with current date
    setFormData({
      date: new Date().toISOString().split('T')[0],
      exerciseName: '',
      sets: '',
      reps: '',
      weight: '',
      intensity: 5,
      notes: ''
    });
  };

  const handleDelete = (exerciseId) => {
    const updatedExercises = fitnessPlan.exercises.filter(exercise => exercise.id !== exerciseId);
    updateFitnessPlan({
      ...fitnessPlan,
      exercises: updatedExercises
    });
  };

  // Group exercises by date
  const groupedExercises = fitnessPlan?.exercises?.reduce((groups, exercise) => {
    const date = exercise.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(exercise);
    return groups;
  }, {}) || {};

  // Format date for display
  const formatDate = (dateString) => {
    // Create a date object and adjust for timezone
    const date = new Date(dateString + 'T00:00:00');
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return adjustedDate.toLocaleDateString(undefined, options);
  };

  return (
    <div className="exercise-tracker">
      <h2>Exercise Tracker</h2>
      
      <div className="exercise-form-container">
        <h3>Add New Exercise</h3>
        <form className="exercise-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="exerciseName">Exercise Name</label>
              <input
                type="text"
                id="exerciseName"
                name="exerciseName"
                value={formData.exerciseName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="intensity">Intensity (1-10)</label>
              <input
                type="range"
                id="intensity"
                name="intensity"
                min="1"
                max="10"
                value={formData.intensity}
                onChange={handleInputChange}
                required
              />
              <span className="intensity-value">{formData.intensity}/10</span>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sets">Sets</label>
              <input
                type="number"
                id="sets"
                name="sets"
                value={formData.sets}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reps">Reps</label>
              <input
                type="number"
                id="reps"
                name="reps"
                value={formData.reps}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Weight (lbs)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any additional notes about your exercise..."
            />
          </div>
          
          <button type="submit" className="submit-button">Add Exercise</button>
        </form>
      </div>

      <div className="exercise-history">
        <h3>Exercise History</h3>
        {Object.keys(groupedExercises).length === 0 ? (
          <div className="no-exercises">No exercises recorded yet</div>
        ) : (
          Object.entries(groupedExercises).map(([date, exercises]) => (
            <div key={date} className="exercise-date-group">
              <h4 className="date-header">{formatDate(date)}</h4>
              <div className="exercise-table-container">
                <table className="exercise-table">
                  <thead>
                    <tr>
                      <th>Exercise</th>
                      <th>Sets</th>
                      <th>Reps</th>
                      <th>Weight</th>
                      <th>Intensity</th>
                      <th>Notes</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercises.map(exercise => (
                      <tr key={exercise.id}>
                        <td>{exercise.exerciseName}</td>
                        <td>{exercise.sets}</td>
                        <td>{exercise.reps}</td>
                        <td>{exercise.weight} lbs</td>
                        <td>{exercise.intensity}/10</td>
                        <td>{exercise.notes || '-'}</td>
                        <td>
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(exercise.id)}
                            title="Delete exercise"
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
          ))
        )}
      </div>
    </div>
  );
};

export default ExerciseTracker; 