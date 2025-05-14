import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFitnessPlan } from '../context/FitnessPlanContext';

function Onboarding({ onComplete }) {
  const navigate = useNavigate();
  const { initializeFitnessPlan } = useFitnessPlan();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    height: {
      feet: '',
      inches: ''
    },
    weight: '',
    fitnessLevel: '',
    goal: '',
    activityLevel: '',
    goalWeight: '',
    weeklyTarget: ''
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

  const weeklyTargets = [
    { value: '0.5', label: 'Light (0.5 lbs/week)', description: 'Gradual, sustainable change' },
    { value: '1.0', label: 'Moderate (1.0 lbs/week)', description: 'Balanced approach' },
    { value: '1.5', label: 'Aggressive (1.5 lbs/week)', description: 'Faster results, more challenging' },
    { value: '2.0', label: 'Very Aggressive (2.0 lbs/week)', description: 'Maximum recommended rate' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('height.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!profile.age) newErrors.age = 'Age is required';
        if (!profile.gender) newErrors.gender = 'Gender is required';
        if (!profile.height.feet) newErrors.heightFeet = 'Height (feet) is required';
        if (!profile.height.inches) newErrors.heightInches = 'Height (inches) is required';
        if (!profile.weight) newErrors.weight = 'Weight is required';
        break;
      case 2:
        if (!profile.fitnessLevel) newErrors.fitnessLevel = 'Fitness level is required';
        if (!profile.activityLevel) newErrors.activityLevel = 'Activity level is required';
        break;
      case 3:
        if (!profile.goal) newErrors.goal = 'Goal is required';
        if (!profile.goalWeight) newErrors.goalWeight = 'Goal weight is required';
        if (profile.goal === 'weight loss' && !profile.weeklyTarget) {
          newErrors.weeklyTarget = 'Weekly weight loss target is required';
        }
        if (profile.goalWeight && Number(profile.goalWeight) <= 0) {
          newErrors.goalWeight = 'Goal weight must be greater than 0';
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 3) {
        handleSubmit();
      } else {
        setStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep()) {
      const formattedProfile = {
        ...profile,
        age: Number(profile.age),
        weight: Number(profile.weight),
        goalWeight: Number(profile.goalWeight),
        height: {
          feet: Number(profile.height.feet),
          inches: Number(profile.height.inches)
        }
      };
      
      initializeFitnessPlan(formattedProfile);
      if (onComplete) onComplete();
      navigate('/dashboard');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="onboarding-step">
            <h2>Basic Information</h2>
            <p>Let's start with some basic information about you.</p>
            
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
                className={errors.age ? 'error' : ''}
              />
              {errors.age && <span className="error-message">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                required
                className={errors.gender ? 'error' : ''}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="height">Height</label>
              <div className="height-inputs">
                <div className="height-input">
                  <input
                    type="number"
                    id="heightFeet"
                    name="height.feet"
                    value={profile.height.feet}
                    onChange={handleChange}
                    min="4"
                    max="7"
                    placeholder="Feet"
                    required
                    className={errors.heightFeet ? 'error' : ''}
                  />
                  <span>ft</span>
                  {errors.heightFeet && <span className="error-message">{errors.heightFeet}</span>}
                </div>
                <div className="height-input">
                  <input
                    type="number"
                    id="heightInches"
                    name="height.inches"
                    value={profile.height.inches}
                    onChange={handleChange}
                    min="0"
                    max="11"
                    placeholder="Inches"
                    required
                    className={errors.heightInches ? 'error' : ''}
                  />
                  <span>in</span>
                  {errors.heightInches && <span className="error-message">{errors.heightInches}</span>}
                </div>
              </div>
              {(errors.heightFeet || errors.heightInches) && (
                <span className="error-message">Height is required</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight (lbs)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={profile.weight}
                onChange={handleChange}
                min="50"
                max="500"
                step="0.1"
                required
                className={errors.weight ? 'error' : ''}
              />
              {errors.weight && <span className="error-message">{errors.weight}</span>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="onboarding-step">
            <h2>Fitness Level & Activity</h2>
            <p>Tell us about your current fitness level and activity.</p>
            
            <div className="form-group">
              <label htmlFor="fitnessLevel">Fitness Level</label>
              <select
                id="fitnessLevel"
                name="fitnessLevel"
                value={profile.fitnessLevel}
                onChange={handleChange}
                required
                className={errors.fitnessLevel ? 'error' : ''}
              >
                <option value="">Select fitness level</option>
                {fitnessLevels.map(level => (
                  <option key={level} value={level.toLowerCase()}>
                    {level}
                  </option>
                ))}
              </select>
              {errors.fitnessLevel && <span className="error-message">{errors.fitnessLevel}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="activityLevel">Activity Level</label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={profile.activityLevel}
                onChange={handleChange}
                required
                className={errors.activityLevel ? 'error' : ''}
              >
                <option value="">Select activity level</option>
                {activityLevels.map(level => (
                  <option key={level} value={level.toLowerCase().split(' ')[0]}>
                    {level}
                  </option>
                ))}
              </select>
              {errors.activityLevel && <span className="error-message">{errors.activityLevel}</span>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="onboarding-step">
            <h2>Your Goals</h2>
            <p>What are your fitness goals?</p>
            
            <div className="form-group">
              <label htmlFor="goal">Primary Goal</label>
              <select
                id="goal"
                name="goal"
                value={profile.goal}
                onChange={handleChange}
                required
                className={errors.goal ? 'error' : ''}
              >
                <option value="">Select your goal</option>
                {goals.map(goal => (
                  <option key={goal} value={goal.toLowerCase()}>
                    {goal}
                  </option>
                ))}
              </select>
              {errors.goal && <span className="error-message">{errors.goal}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="goalWeight">Goal Weight (lbs)</label>
              <input
                type="number"
                id="goalWeight"
                name="goalWeight"
                value={profile.goalWeight}
                onChange={handleChange}
                min="50"
                max="500"
                step="0.1"
                required
                className={errors.goalWeight ? 'error' : ''}
              />
              {errors.goalWeight && <span className="error-message">{errors.goalWeight}</span>}
            </div>

            {profile.goal === 'weight loss' && (
              <div className="form-group">
                <label htmlFor="weeklyTarget">Weekly Weight Loss Target</label>
                <select
                  id="weeklyTarget"
                  name="weeklyTarget"
                  value={profile.weeklyTarget}
                  onChange={handleChange}
                  required
                  className={errors.weeklyTarget ? 'error' : ''}
                >
                  <option value="">Select weekly target</option>
                  {weeklyTargets.map(target => (
                    <option key={target.value} value={target.value}>
                      {target.label} - {target.description}
                    </option>
                  ))}
                </select>
                {errors.weeklyTarget && <span className="error-message">{errors.weeklyTarget}</span>}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding">
      <div className="onboarding-container">
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        
        {renderStep()}
        
        <div className="onboarding-buttons">
          {step > 1 && (
            <button 
              type="button" 
              className="back-button"
              onClick={handleBack}
            >
              Back
            </button>
          )}
          <button 
            type="button" 
            className={step === 3 ? "submit-button" : "next-button"}
            onClick={handleNext}
          >
            {step === 3 ? 'Complete Setup' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Onboarding; 