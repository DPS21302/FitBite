// models/User.js

const mongoose = require("mongoose");

const mealEntrySchema = new mongoose.Schema({
  name: String,
  calories: Number,
  quantity: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: String,
    photoURL: String,
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profile: {
      age: Number,
      gender: String,
      height: Number,
      currentWeight: Number,
      targetWeight: Number,
      bodyFrame: String,
      medicalConditions: [String],
      allergies: String,
      medications: String,
      dietType: String,
      preferredCuisines: [String],
      dislikedFoods: String,
      favoriteFoods: String,
      currentSupplements: String,
      supplementWillingness: String,
    },
    calorieTracking: {
      bmr: Number,
      dailyCalorieNeeds: Number,
      activityLevel: String,
      mealEntries: [mealEntrySchema]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);