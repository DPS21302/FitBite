// controllers/bodyFatController.js

const BodyFat = require('../models/BodyFat');
const User = require('../models/User');

exports.saveBodyFat = async (req, res) => {
  const { userId, weight, waist, hip, neck, bodyFat } = req.body;

  try {
    const user = await User.findOne({ firebaseUid: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newBodyFat = new BodyFat({
      user: user._id,
      weight,
      waist,
      hip,
      neck,
      bodyFatPercentage : bodyFat,
    });

    await newBodyFat.save();

    res.status(200).json({ message: 'Body Fat data saved successfully', bodyFat: newBodyFat });
  } catch (error) {
    console.error('Error saving Body Fat data:', error);
    res.status(500).json({ message: 'Error saving Body Fat data', error });
  }
};
