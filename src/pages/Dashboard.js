import React, { useState } from 'react';
import { useFitnessPlan } from '../context/FitnessPlanContext';

function Dashboard() {
  const { fitnessPlan, updateFitnessPlan, initializeFitnessPlan } = useFitnessPlan();
  const [editingSection, setEditingSection] = useState(null);
  const [editForm, setEditForm] = useState({});

  if (!fitnessPlan) {
    return (
      <div className="dashboard">
        <h2>Loading your fitness plan...</h2>
      </div>
    );
  }

  const { profile, metrics, progress } = fitnessPlan;

  const handleEdit = (section) => {
    setEditingSection(section);
    setEditForm(fitnessPlan[section]);
  };

  const handleRecalculate = () => {
    // Ensure we have all required profile data
    if (!profile || !profile.age || !profile.height || !profile.weight || !profile.activityLevel) {
      console.error('Missing required profile data for recalculation');
      return;
    }

    // Recalculate all metrics based on current profile data
    initializeFitnessPlan({
      ...profile,
      // Ensure all numeric values are numbers
      age: Number(profile.age),
      weight: Number(profile.weight),
      height: {
        feet: Number(profile.height.feet),
        inches: Number(profile.height.inches)
      }
    });
    
    setEditingSection(null);
  };

  const handleSave = (section) => {
    const updatedPlan = {
      ...fitnessPlan,
      [section]: editForm
    };
    
    // If profile is updated, recalculate metrics
    if (section === 'profile') {
      initializeFitnessPlan(editForm);
    } else {
      updateFitnessPlan(updatedPlan);
    }
    
    setEditingSection(null);
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditForm({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested height values
    if (name.includes('height.')) {
      const [parent, child] = name.split('.');
      setEditForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: Number(value)
        }
      }));
    } else {
      // Convert numeric values to numbers
      const numericValue = ['age', 'weight'].includes(name) ? Number(value) : value;
      setEditForm(prev => ({
        ...prev,
        [name]: numericValue
      }));
    }
  };

  const renderEditForm = (section) => {
    switch (section) {
      case 'profile':
        return (
          <div className="edit-form">
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={editForm.age}
                onChange={handleInputChange}
                min="16"
                max="100"
              />
            </div>
            <div className="form-group">
              <label>Height (feet)</label>
              <input
                type="number"
                name="height.feet"
                value={editForm.height?.feet}
                onChange={handleInputChange}
                min="4"
                max="7"
              />
            </div>
            <div className="form-group">
              <label>Height (inches)</label>
              <input
                type="number"
                name="height.inches"
                value={editForm.height?.inches}
                onChange={handleInputChange}
                min="0"
                max="11"
              />
            </div>
            <div className="form-group">
              <label>Weight (lbs)</label>
              <input
                type="number"
                name="weight"
                value={editForm.weight}
                onChange={handleInputChange}
                min="50"
                max="500"
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label>Fitness Level</label>
              <select name="fitnessLevel" value={editForm.fitnessLevel} onChange={handleInputChange}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label>Activity Level</label>
              <select name="activityLevel" value={editForm.activityLevel} onChange={handleInputChange}>
                <option value="sedentary">Sedentary</option>
                <option value="lightly">Lightly Active</option>
                <option value="moderately">Moderately Active</option>
                <option value="very">Very Active</option>
                <option value="extremely">Extremely Active</option>
              </select>
            </div>
            <div className="edit-form-buttons">
              <button onClick={() => handleSave('profile')} className="save-button">Save</button>
              <button onClick={handleCancel} className="cancel-button">Cancel</button>
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="edit-form">
            <div className="form-group">
              <label>Goal</label>
              <select name="goal" value={editForm.goal} onChange={handleInputChange}>
                <option value="weight loss">Weight Loss</option>
                <option value="muscle gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
                <option value="strength">Strength</option>
                <option value="general fitness">General Fitness</option>
                <option value="sports performance">Sports Performance</option>
              </select>
            </div>
            <div className="form-group">
              <label>Goal Weight (lbs)</label>
              <input
                type="number"
                name="goalWeight"
                value={editForm.goalWeight}
                onChange={handleInputChange}
                min="50"
                max="500"
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label>Weekly Target (lbs/week)</label>
              <input
                type="number"
                name="weeklyTarget"
                value={editForm.weeklyTarget}
                onChange={handleInputChange}
                min="0.5"
                max="2"
                step="0.1"
              />
            </div>
            <div className="edit-form-buttons">
              <button onClick={() => handleSave('progress')} className="save-button">Save</button>
              <button onClick={handleCancel} className="cancel-button">Cancel</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <h2>Your Fitness Dashboard</h2>
      
      <div className="dashboard-grid">
        {/* Profile Overview Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Profile Overview</h2>
            <div className="card-actions">
              <button 
                className="edit-button"
                onClick={() => handleEdit('profile')}
              >
                Edit
              </button>
            </div>
          </div>
          {editingSection === 'profile' ? (
            renderEditForm('profile')
          ) : (
            <div className="profile-overview">
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-label">Age</span>
                  <span className="stat-value">{profile.age} years</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Gender</span>
                  <span className="stat-value">{profile.gender}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Height</span>
                  <span className="stat-value">{`${profile.height.feet}'${profile.height.inches}"`}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Weight</span>
                  <span className="stat-value">{profile.weight} lbs</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Fitness Level</span>
                  <span className="stat-value">{profile.fitnessLevel}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Activity Level</span>
                  <span className="stat-value">{profile.activityLevel}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Goals Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Your Goals</h2>
            <div className="card-actions">
              <button 
                className="edit-button"
                onClick={() => handleEdit('goals')}
              >
                Edit
              </button>
            </div>
          </div>
          {editingSection === 'goals' ? (
            renderEditForm('goals')
          ) : (
            <div className="goals-overview">
              <div className="goals-stats">
                <div className="stat-item">
                  <span className="stat-label">Primary Goal</span>
                  <span className="stat-value">{profile.goal}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Goal Weight</span>
                  <span className="stat-value">{profile.goalWeight} lbs</span>
                </div>
                {profile.goal === 'weight loss' && (
                  <div className="stat-item">
                    <span className="stat-label">Weekly Target</span>
                    <span className="stat-value">{profile.weeklyTarget} lbs/week</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 