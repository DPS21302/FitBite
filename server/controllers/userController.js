const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  const { userId, profileData } = req.body;

  try {
    console.log("userId:", userId);

    // Find user by Firebase UID
    const user = await User.findOne({ firebaseUid: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile
    user.profile = {
      age: profileData.age,
      gender: profileData.gender,
      height: profileData.height,
      currentWeight: profileData.currentWeight,
      targetWeight: profileData.targetWeight,
      bodyFrame: profileData.bodyFrame,
      medicalConditions: profileData.medicalConditions,
      allergies: profileData.allergies,
      medications: profileData.medications,
      dietType: profileData.dietType,
      preferredCuisines: profileData.preferredCuisines,
      dislikedFoods: profileData.dislikedFoods,
      favoriteFoods: profileData.favoriteFoods,
      currentSupplements: profileData.currentSupplements,
      supplementWillingness: profileData.supplementWillingness,
    };

    await user.save();

    res
      .status(200)
      .json({ message: "Profile updated successfully", profile: user.profile });
  } catch (error) {
    console.error("Error updating profile data:", error);
    res.status(500).json({ message: "Error updating profile data", error });
  }
};

exports.getMyProfile = async (req, res) => {
  const { firebaseUid } = req.params;
  try {
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to update user profile by firebaseUid
exports.updateMyProfile = async (req, res) => {
  const { firebaseUid } = req.params;
  const updates = req.body;
  try {
    const user = await User.findOneAndUpdate({ firebaseUid }, updates, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
