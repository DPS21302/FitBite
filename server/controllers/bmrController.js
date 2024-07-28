// controllers/bmrController.js

const BMR = require('../models/BMR');
const User = require('../models/User');

exports.saveBMR = async (req, res) => {
  const { userId, age, gender, weight, height, bmr } = req.body;

  try {
    const user = await User.findOne({ firebaseUid: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newBMR = new BMR({
      user: user._id,
      age,
      gender,
      weight,
      height,
      bmr,
    });

    await newBMR.save();

    res.status(200).json({ message: 'BMR data saved successfully', bmr: newBMR });
  } catch (error) {
    console.error('Error saving BMR data:', error);
    res.status(500).json({ message: 'Error saving BMR data', error });
  }
};
