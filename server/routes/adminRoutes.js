const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getBMIStats,
  getBMRStats,
  getBodyFatStats,
  getUserCount,
  getUserGrowth,
  getGenderDistribution,
  getAverageAge,
  getActiveUsers,
  getAverageCalories,
} = require("../controllers/adminController");


router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);


router.get("/userGrowth", getUserGrowth);
router.get("/genderDistribution", getGenderDistribution);
router.get("/averageAge", getAverageAge);
router.get("/activeUsers", getActiveUsers);
router.get("/averageCalories", getAverageCalories);

router.get("/bmi", getBMIStats);
router.get("/bmr", getBMRStats);
router.get("/bodyfat", getBodyFatStats);
router.get("/totalUsers", getUserCount);

module.exports = router;
