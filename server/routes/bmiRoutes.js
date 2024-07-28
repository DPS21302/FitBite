const express = require('express');
const router = express.Router();
const { saveBMI } = require('../controllers/bmiController');
const { saveBMR } = require('../controllers/bmrController');
const { saveBodyFat } = require('../controllers/bodyFatController');

router.post('/saveBMI', saveBMI);
router.post('/saveBMR', saveBMR);
router.post('/saveBodyFat', saveBodyFat);

module.exports = router;
