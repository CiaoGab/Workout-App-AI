import React, { createContext, useContext, useState, useEffect } from 'react';

const FitnessPlanContext = createContext();

export function FitnessPlanProvider({ children }) {
  const [fitnessPlan, setFitnessPlan] = useState({
    // User Profile
    profile: {
      age: null,
      gender: null,
      height: {
        feet: null,
        inches: null
      },
      weight: null,
      fitnessLevel: null,
      activityLevel: null,
      goal: null,
      medicalConditions: null
    },
    // Calculated Metrics
    metrics: {
      bmr: null,          // Basal Metabolic Rate
      tdee: null,         // Total Daily Energy Expenditure
      targetCalories: null, // Daily calorie target based on goal
      macros: {
        protein: {
          grams: null,
          calories: null,
          percentage: null
        },
        carbs: {
          grams: null,
          calories: null,
          percentage: null
        },
        fat: {
          grams: null,
          calories: null,
          percentage: null
        }
      },
      heartRateZones: {
        maxHR: null,
        zones: []
      }
    },
    // Progress Tracking
    progress: {
      startDate: null,
      startWeight: null,
      currentWeight: null,
      goalWeight: null,
      weeklyTarget: null,  // Weekly weight change target
      weightHistory: []
    }
  });

  // Load saved fitness plan from localStorage on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem('fitnessPlan');
    if (savedPlan) {
      setFitnessPlan(JSON.parse(savedPlan));
    }
  }, []);

  // Save fitness plan to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fitnessPlan', JSON.stringify(fitnessPlan));
  }, [fitnessPlan]);

  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = (profile) => {
    const heightInInches = (profile.height.feet * 12) + profile.height.inches;
    let bmr;
    if (profile.gender === 'male') {
      bmr = Math.round((10 * profile.weight) + (6.25 * heightInInches) - (5 * profile.age) + 5);
    } else {
      bmr = Math.round((10 * profile.weight) + (6.25 * heightInInches) - (5 * profile.age) - 161);
    }
    return bmr;
  };

  // Calculate TDEE based on activity level
  const calculateTDEE = (bmr, activityLevel) => {
    console.log('Calculating TDEE with:', { bmr, activityLevel });
    
    const activityMultipliers = {
      'sedentary': 1.2,
      'lightly': 1.375,
      'moderately': 1.55,
      'very': 1.725,
      'extremely': 1.9
    };
    
    // Extract the first word from the activity level string and convert to lowercase
    const activityKey = activityLevel.toLowerCase().split(' ')[0];
    console.log('Activity key:', activityKey);
    console.log('Activity multiplier:', activityMultipliers[activityKey]);
    
    const tdee = Math.round(bmr * activityMultipliers[activityKey]);
    console.log('Calculated TDEE:', tdee);
    return tdee;
  };

  // Calculate heart rate zones
  const calculateHeartRateZones = (age) => {
    const maxHR = 220 - age;
    return {
      maxHR,
      zones: [
        {
          name: "VO2 Max Zone",
          range: "90% - 100%",
          min: Math.round(maxHR * 0.9),
          max: Math.round(maxHR * 1.0),
          description: "Maximum effort, short duration"
        },
        {
          name: "Anaerobic Zone",
          range: "80% - 90%",
          min: Math.round(maxHR * 0.8),
          max: Math.round(maxHR * 0.9),
          description: "High intensity, short duration"
        },
        {
          name: "Aerobic Zone",
          range: "70% - 80%",
          min: Math.round(maxHR * 0.7),
          max: Math.round(maxHR * 0.8),
          description: "Moderate intensity, longer duration"
        },
        {
          name: "Fat Burn Zone",
          range: "60% - 70%",
          min: Math.round(maxHR * 0.6),
          max: Math.round(maxHR * 0.7),
          description: "Light to moderate intensity"
        },
        {
          name: "Warm Up Zone",
          range: "50% - 60%",
          min: Math.round(maxHR * 0.5),
          max: Math.round(maxHR * 0.6),
          description: "Very light intensity"
        }
      ]
    };
  };

  // Calculate target calories based on goal
  const calculateTargetCalories = (tdee, goal, weeklyTarget) => {
    console.log('Calculating target calories with:', { tdee, goal, weeklyTarget });
    
    // Base adjustments for different goals
    const baseAdjustments = {
      'weight loss': -500,
      'muscle gain': 500,
      'endurance': -250,
      'strength': 300,
      'general fitness': 0,
      'sports performance': 250
    };
    
    // Convert goal to lowercase for consistent comparison
    const goalKey = goal.toLowerCase();
    console.log('Goal key:', goalKey);
    
    let targetCalories;
    
    // If we have a weekly target and it's a weight-related goal, use it for precise calculation
    if (weeklyTarget && (goalKey === 'weight loss' || goalKey === 'muscle gain')) {
      // 3500 calories ≈ 1 lb of fat/muscle
      const weeklyCalorieAdjustment = weeklyTarget * 3500;
      const dailyCalorieAdjustment = Math.round(weeklyCalorieAdjustment / 7);
      targetCalories = Math.round(tdee + dailyCalorieAdjustment);
      console.log('Using weekly target for calculation:', { weeklyTarget, weeklyCalorieAdjustment, dailyCalorieAdjustment });
    } else {
      // Use base adjustments for other goals
      targetCalories = Math.round(tdee + (baseAdjustments[goalKey] || 0));
      console.log('Using base adjustment:', baseAdjustments[goalKey]);
    }
    
    console.log('Calculated target calories:', targetCalories);
    return targetCalories;
  };

  // Calculate macro distribution based on goal and calories
  const calculateMacros = (targetCalories, goal, weight) => {
    console.log('Calculating macros with:', { targetCalories, goal, weight });
    
    // Base macro ratios for different goals
    const macroRatios = {
      'weight loss': {
        protein: 0.4,  // 40% of calories
        fat: 0.3,      // 30% of calories
        carbs: 0.3     // 30% of calories
      },
      'muscle gain': {
        protein: 0.35, // 35% of calories
        fat: 0.25,     // 25% of calories
        carbs: 0.4     // 40% of calories
      },
      'endurance': {
        protein: 0.25, // 25% of calories
        fat: 0.25,     // 25% of calories
        carbs: 0.5     // 50% of calories
      },
      'strength': {
        protein: 0.35, // 35% of calories
        fat: 0.3,      // 30% of calories
        carbs: 0.35    // 35% of calories
      },
      'general fitness': {
        protein: 0.3,  // 30% of calories
        fat: 0.3,      // 30% of calories
        carbs: 0.4     // 40% of calories
      },
      'sports performance': {
        protein: 0.3,  // 30% of calories
        fat: 0.25,     // 25% of calories
        carbs: 0.45    // 45% of calories
      }
    };

    // Get the appropriate macro ratios for the goal
    const goalKey = goal.toLowerCase();
    const ratios = macroRatios[goalKey] || macroRatios['general fitness'];

    // Calculate calories for each macro
    const proteinCalories = Math.round(targetCalories * ratios.protein);
    const fatCalories = Math.round(targetCalories * ratios.fat);
    const carbsCalories = Math.round(targetCalories * ratios.carbs);

    // Calculate grams for each macro
    // Protein: 4 calories per gram
    // Carbs: 4 calories per gram
    // Fat: 9 calories per gram
    const proteinGrams = Math.round(proteinCalories / 4);
    const carbsGrams = Math.round(carbsCalories / 4);
    const fatGrams = Math.round(fatCalories / 9);

    // Ensure minimum protein requirements (0.8g per pound of body weight)
    const minProteinGrams = Math.round(weight * 0.8);
    if (proteinGrams < minProteinGrams) {
      const additionalProteinGrams = minProteinGrams - proteinGrams;
      const additionalProteinCalories = additionalProteinGrams * 4;
      
      // Adjust carbs to compensate for additional protein
      const adjustedCarbsGrams = Math.round((carbsCalories - additionalProteinCalories) / 4);
      
      return {
        protein: {
          grams: minProteinGrams,
          calories: minProteinGrams * 4,
          percentage: (minProteinGrams * 4) / targetCalories
        },
        carbs: {
          grams: adjustedCarbsGrams,
          calories: adjustedCarbsGrams * 4,
          percentage: (adjustedCarbsGrams * 4) / targetCalories
        },
        fat: {
          grams: fatGrams,
          calories: fatGrams * 9,
          percentage: (fatGrams * 9) / targetCalories
        }
      };
    }

    return {
      protein: {
        grams: proteinGrams,
        calories: proteinCalories,
        percentage: ratios.protein
      },
      carbs: {
        grams: carbsGrams,
        calories: carbsCalories,
        percentage: ratios.carbs
      },
      fat: {
        grams: fatGrams,
        calories: fatCalories,
        percentage: ratios.fat
      }
    };
  };

  // Update the entire fitness plan
  const updateFitnessPlan = (newPlan) => {
    setFitnessPlan(prevPlan => ({
      ...prevPlan,
      ...newPlan
    }));
  };

  // Initialize fitness plan from onboarding data
  const initializeFitnessPlan = (profileData) => {
    console.log('Initializing fitness plan with profile data:', profileData);
    
    const bmr = calculateBMR(profileData);
    console.log('Calculated BMR:', bmr);
    
    const tdee = calculateTDEE(bmr, profileData.activityLevel);
    const heartRateZones = calculateHeartRateZones(profileData.age);
    const targetCalories = calculateTargetCalories(tdee, profileData.goal, profileData.weeklyTarget);
    const macros = calculateMacros(targetCalories, profileData.goal, profileData.weight);

    const newPlan = {
      profile: profileData,
      metrics: {
        bmr,
        tdee,
        targetCalories,
        macros,
        heartRateZones
      },
      progress: {
        startDate: new Date().toISOString(),
        startWeight: profileData.weight,
        currentWeight: profileData.weight,
        goalWeight: profileData.goalWeight,
        weeklyTarget: Number(profileData.weeklyTarget),
        weightHistory: [{
          date: new Date().toISOString(),
          weight: profileData.weight
        }]
      }
    };

    console.log('Final fitness plan:', newPlan);
    setFitnessPlan(newPlan);
  };

  // Update weight and progress
  const updateWeight = (newWeight) => {
    setFitnessPlan(prevPlan => ({
      ...prevPlan,
      progress: {
        ...prevPlan.progress,
        currentWeight: newWeight,
        weightHistory: [
          ...prevPlan.progress.weightHistory,
          {
            date: new Date().toISOString(),
            weight: newWeight
          }
        ]
      }
    }));
  };

  const value = {
    fitnessPlan,
    updateFitnessPlan,
    initializeFitnessPlan,
    updateWeight
  };

  return (
    <FitnessPlanContext.Provider value={value}>
      {children}
    </FitnessPlanContext.Provider>
  );
}

export function useFitnessPlan() {
  const context = useContext(FitnessPlanContext);
  if (context === undefined) {
    throw new Error('useFitnessPlan must be used within a FitnessPlanProvider');
  }
  return context;
} 