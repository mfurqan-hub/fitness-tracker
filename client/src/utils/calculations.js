/**
 * Fitness Calculations & Metrics Helper
 */

// Calculate BMI: weight (kg) / (height (m) ^ 2)
export const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm || heightCm <= 0) return { bmi: 0, category: 'N/A', color: 'gray' };
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  let category = 'Normal';
  let color = 'emerald';

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'amber';
  } else if (bmi < 25) {
    category = 'Normal Weight';
    color = 'emerald';
  } else if (bmi < 30) {
    category = 'Overweight';
    color = 'amber';
  } else {
    category = 'Obese';
    color = 'rose';
  }

  return { bmi, category, color };
};

// Calculate BMR (Mifflin-St Jeor Equation)
export const calculateBMR = (weightKg, heightCm, ageYears, gender = 'male') => {
  if (!weightKg || !heightCm || !ageYears) return 2000;
  const s = gender === 'female' ? -161 : 5;
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * ageYears + s);
};

// Calculate TDEE based on activity level multiplier
export const calculateTDEE = (bmr, activityLevel = 'moderate') => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.55));
};

// Estimate 1-Rep Max (Brzycki formula)
export const calculate1RM = (weightKg, reps) => {
  if (!weightKg || !reps || reps <= 0) return 0;
  if (reps === 1) return weightKg;
  return Math.round(weightKg * (36 / (37 - reps)));
};

// Target Macro split based on goal
export const getRecommendedMacros = (calories, goal = 'muscle_gain') => {
  let proteinRatio = 0.3;
  let carbRatio = 0.45;
  let fatRatio = 0.25;

  if (goal === 'weight_loss') {
    proteinRatio = 0.35;
    carbRatio = 0.35;
    fatRatio = 0.3;
  } else if (goal === 'muscle_gain') {
    proteinRatio = 0.3;
    carbRatio = 0.5;
    fatRatio = 0.2;
  } else if (goal === 'endurance') {
    proteinRatio = 0.2;
    carbRatio = 0.6;
    fatRatio = 0.2;
  }

  return {
    calories: Math.round(calories),
    proteinGrams: Math.round((calories * proteinRatio) / 4),
    carbGrams: Math.round((calories * carbRatio) / 4),
    fatGrams: Math.round((calories * fatRatio) / 9)
  };
};
