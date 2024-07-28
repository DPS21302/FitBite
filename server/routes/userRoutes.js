const express = require('express');
const { updateProfile,getMyProfile,updateMyProfile } = require('../controllers/userController');

const router = express.Router();

router.post('/update', updateProfile);
router.get('/myprofile/:firebaseUid', getMyProfile);
router.put('/myprofile/:firebaseUid', updateMyProfile);

module.exports = router;
