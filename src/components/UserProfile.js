import React, { useState } from 'react';

function UserProfile() {
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    heightFeet: '',
    heightInches: '',
    fitnessLevel: '',
    goal: '',
    timeline: '',
    activityLevel: '',
    medicalConditions: ''
  });

  const fitnessLevels = [
    'Beginner',
    'Intermediate',
    'Advanced'
  ];

  const goals = [
    'Weight Loss',
    'Muscle Gain',
    'Endurance',
    'Strength',
    'General Fitness',
    'Sports Performance'
  ];

  const activityLevels = [
    'Sedentary (little or no exercise)',
    'Lightly Active (light exercise 1-3 days/week)',
    'Moderately Active (moderate exercise 3-5 days/week)',
    'Very Active (hard exercise 6-7 days/week)',
    'Extremely Active (very hard exercise & physical job)'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement save functionality
    console.log('Profile saved:', profile);
  };

  return (
    <div className="user-profile">
      <h2>Your Profile & Goals</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={profile.age}
              onChange={handleChange}
              min="16"
              max="100"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="height">Height</label>
            <div className="height-inputs">
              <div className="height-input">
                <input
                  type="number"
                  id="heightFeet"
                  name="heightFeet"
                  value={profile.heightFeet}
                  onChange={handleChange}
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
                  value={profile.heightInches}
                  onChange={handleChange}
                  min="0"
                  max="11"
                  placeholder="Inches"
                  required
                />
                <span>in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Fitness Assessment</h3>
          <div className="form-group">
            <label htmlFor="fitnessLevel">Current Fitness Level</label>
            <select
              id="fitnessLevel"
              name="fitnessLevel"
              value={profile.fitnessLevel}
              onChange={handleChange}
              required
            >
              <option value="">Select fitness level</option>
              {fitnessLevels.map(level => (
                <option key={level} value={level.toLowerCase()}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="activityLevel">Activity Level</label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={profile.activityLevel}
              onChange={handleChange}
              required
            >
              <option value="">Select activity level</option>
              {activityLevels.map(level => (
                <option key={level} value={level.toLowerCase()}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Goals & Timeline</h3>
          <div className="form-group">
            <label htmlFor="goal">Primary Goal</label>
            <select
              id="goal"
              name="goal"
              value={profile.goal}
              onChange={handleChange}
              required
            >
              <option value="">Select your goal</option>
              {goals.map(goal => (
                <option key={goal} value={goal.toLowerCase()}>
                  {goal}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="timeline">Target Timeline</label>
            <select
              id="timeline"
              name="timeline"
              value={profile.timeline}
              onChange={handleChange}
              required
            >
              <option value="">Select timeline</option>
              <option value="1month">1 Month</option>
              <option value="3months">3 Months</option>
              <option value="6months">6 Months</option>
              <option value="1year">1 Year</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Medical Information (Optional)</h3>
          <div className="form-group">
            <label htmlFor="medicalConditions">Medical Conditions or Limitations</label>
            <textarea
              id="medicalConditions"
              name="medicalConditions"
              value={profile.medicalConditions}
              onChange={handleChange}
              placeholder="Please list any medical conditions, injuries, or limitations that might affect your fitness routine"
              rows="4"
            />
          </div>
        </div>

        <button type="submit" className="submit-button">Save Profile</button>
      </form>
    </div>
  );
}

export default UserProfile; 