const admin = require('firebase-admin');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { email, password, displayName } = req.body;
  
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    const newUser = new User({
      firebaseUid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      isAdmin: false, 
    });

    await newUser.save();

    res.status(201).json({ uid: userRecord.uid, email: userRecord.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  // Firebase Authentication is handled on the client-side
  res.status(200).json({ message: 'Login should be handled on the client-side with Firebase SDK' });
};

exports.saveUser = async (req, res) => {
  try {
    const { firebaseUid, email, displayName, photoURL } = req.body;

    // Check if user already exists
    let user = await User.findOne({ firebaseUid });

    if (user) {
      // Update existing user
      user.email = email;
      user.displayName = displayName;
      user.photoURL = photoURL;
    } else {
      // Create new user
      user = new User({
        firebaseUid,
        email,
        displayName,
        photoURL,
        isAdmin: false,
      });
    }

    await user.save();
    res.status(200).json({ message: 'User saved successfully', user });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Error saving user' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.protected = (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
};