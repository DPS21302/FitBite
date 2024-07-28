const express = require('express');
const { signup, login, getUser, protected,saveUser } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { loginAdmin } = require('../controllers/adminController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/saveUser', verifyToken, saveUser);
router.get('/user', verifyToken, getUser);
router.get('/protected', verifyToken, protected);
router.post('/checkAdmin', loginAdmin);

module.exports = router;