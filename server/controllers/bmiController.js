const BMI = require('../models/BMI');
const User = require('../models/User');

exports.saveBMI = async (req, res) => {
  const { userId, weight, height, bmi } = req.body;

  try {
    console.log('userId:', userId);

    // Find user by Firebase UID
    const user = await User.findOne({ firebaseUid: userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new BMI instance
    const newBMI = new BMI({
      user: user._id, // MongoDB ObjectId of the user
      weight,
      height,
      bmi,
    });

    // Save BMI data
    await newBMI.save();

    res.status(200).json({ message: 'BMI data saved successfully', bmi: newBMI });
  } catch (error) {
    console.error('Error saving BMI data:', error);
    res.status(500).json({ message: 'Error saving BMI data', error });
  }
};
