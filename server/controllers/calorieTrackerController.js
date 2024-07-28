// controllers/calorieTrackerController.js

const User = require('../models/User');

exports.calculateBMR = async (req, res) => {
  const { firebaseUid, age, gender, weight, height, activityLevel } = req.body;

  try {
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === 'female') {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const dailyCalorieNeeds = bmr * activityMultipliers[activityLevel];

    user.calorieTracking = {
      bmr,
      dailyCalorieNeeds,
      activityLevel
    };

    await user.save();

    res.json({ bmr, dailyCalorieNeeds });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating BMR', error: error.message });
  }
};

exports.addMeal = async (req, res) => {
  const { firebaseUid, name, calories, quantity, date } = req.body;

  try {
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newMeal = {
      name,
      calories,
      quantity,
      date: new Date(date)
    };

    user.calorieTracking.mealEntries.push(newMeal);
    await user.save();

    res.status(201).json(newMeal);
  } catch (error) {
    res.status(500).json({ message: 'Error adding meal', error: error.message });
  }
};

exports.getMealsByDate = async (req, res) => {
  const { firebaseUid } = req.query;
  const { date } = req.params;

  try {
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const meals = user.calorieTracking.mealEntries.filter(meal => 
      meal.date >= startDate && meal.date <= endDate
    );

    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meals', error: error.message });
  }
};

exports.updateMeal = async (req, res) => {
  const { firebaseUid, name, calories, quantity } = req.body;
  const { mealId } = req.params;

  try {
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const meal = user.calorieTracking.mealEntries.id(mealId);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    meal.name = name;
    meal.calories = calories;
    meal.quantity = quantity;

    await user.save();

    res.json(meal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating meal', error: error.message });
  }
};

exports.deleteMeal = async (req, res) => {
  const { firebaseUid } = req.query;
  const { mealId } = req.params;

  try {
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.calorieTracking.mealEntries.id(mealId).remove();
    await user.save();

    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting meal', error: error.message });
  }
};

exports.getCalorieSummary = async (req, res) => {
  const { firebaseUid } = req.query;
  const { date } = req.params;

  try {
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const meals = user.calorieTracking.mealEntries.filter(meal => 
      meal.date >= startDate && meal.date <= endDate
    );

    const consumedCalories = meals.reduce((total, meal) => total + meal.calories, 0);
    const remainingCalories = user.calorieTracking.dailyCalorieNeeds - consumedCalories;

    res.json({
      dailyGoal: user.calorieTracking.dailyCalorieNeeds,
      consumed: consumedCalories,
      remaining: remainingCalories
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching calorie summary', error: error.message });
  }
};

exports.getUserData = async (req, res) => {
  const { firebaseUid } = req.query;

  try {
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      bmr: user.calorieTracking.bmr,
      dailyCalorieNeeds: user.calorieTracking.dailyCalorieNeeds,
      activityLevel: user.calorieTracking.activityLevel
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
};