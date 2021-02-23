const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/doctor/doctorController');
const authController = require('../controllers/authController');

router.get('/', authController.isLogged, doctorController.getIndex);

module.exports = router;