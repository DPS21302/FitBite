const User = require("../models/User");
const BMI = require("../models/BMI");
const BMR = require("../models/BMR");
const BodyFat = require("../models/BodyFat");

exports.loginAdmin = async (req, res) => {
  const { uid } = req.body;

  try {
    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res
        .status(404)
        .json({ isAdmin: false, message: "User not found" });
    }

    if (user.isAdmin) {
      return res.status(200).json({ isAdmin: true });
    } else {
      return res.status(403).json({ isAdmin: false, message: "Access denied" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { firebaseUid, email, displayName, photoURL, isAdmin, profile } =
    req.body;

  const newUser = new User({
    firebaseUid,
    email,
    displayName,
    photoURL,
    isAdmin,
    profile,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getUserGrowth = async (req, res) => {
  try {
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 } // Last 30 days
    ]);

    res.status(200).json(userGrowth.map(item => ({ date: item._id, count: item.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGenderDistribution = async (req, res) => {
  try {
    const genderDistribution = await User.aggregate([
      {
        $group: {
          _id: "$profile.gender",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = genderDistribution.reduce((acc, item) => {
      acc[item._id || 'Unknown'] = item.count;
      return acc;
    }, {});

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAverageAge = async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: null,
          averageAge: { $avg: "$profile.age" }
        }
      }
    ]);

    const averageAge = result[0] ? result[0].averageAge : 0;
    res.status(200).json({ averageAge });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActiveUsers = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ updatedAt: { $gte: thirtyDaysAgo } });
    const activePercentage = (activeUsers / totalUsers) * 100;

    res.status(200).json({ activePercentage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAverageCalories = async (req, res) => {
  try {
    const result = await User.aggregate([
      { $unwind: "$calorieTracking.mealEntries" },
      {
        $group: {
          _id: null,
          averageCalories: { $avg: "$calorieTracking.mealEntries.calories" }
        }
      }
    ]);

    const averageCalories = result[0] ? result[0].averageCalories : 0;
    res.status(200).json({ averageCalories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getBMIStats = async (req, res) => {
  try {
    const bmiStats = await BMI.aggregate([
      {
        $group: {
          _id: "$gender",
          averageBMI: { $avg: "$bmi" },
          minBMI: { $min: "$bmi" },
          maxBMI: { $max: "$bmi" },
          totalEntries: { $sum: 1 },
        },
      },
    ]);

    // Assuming you want to return the first item in the array, or an empty object if no data
    res.json(bmiStats[0] || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBMRStats = async (req, res) => {
  try {
    const bmrStats = await BMR.aggregate([
      {
        $group: {
          _id: "$gender",
          averageBMR: { $avg: "$bmr" },
          minBMR: { $min: "$bmr" },
          maxBMR: { $max: "$bmr" },
          totalEntries: { $sum: 1 },
        },
      },
    ]);
    res.json(bmrStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBodyFatStats = async (req, res) => {
  try {
    const bodyFatStats = await BodyFat.aggregate([
      {
        $group: {
          _id: null,
          averageBodyFat: { $avg: "$bodyFatPercentage" },
          minBodyFat: { $min: "$bodyFatPercentage" },
          maxBodyFat: { $max: "$bodyFatPercentage" },
          totalEntries: { $sum: 1 },
        },
      },
    ]);
    res.json(bodyFatStats[0] || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserCount = async (req, res) => {
  try {
    const users = await User.find();
    const count = users.length;
    res.json({ count });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ message: "Error fetching user count", error: error.message });
  }
};

