// routes/calorieTracker.js

const express = require('express');
const router = express.Router();
const calorieTrackerController = require('../controllers/calorieTrackerController');

router.post('/calculate-bmr', calorieTrackerController.calculateBMR);
router.post('/add-meal', calorieTrackerController.addMeal);
router.get('/meals/:date', calorieTrackerController.getMealsByDate);
router.put('/update-meal/:mealId', calorieTrackerController.updateMeal);
router.delete('/delete-meal/:mealId', calorieTrackerController.deleteMeal);
router.get('/summary/:date', calorieTrackerController.getCalorieSummary);
router.get('/user-data', calorieTrackerController.getUserData);

module.exports = router;