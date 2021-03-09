const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/doctor/doctorController');
const authController = require('../controllers/authController');

router.get('/', authController.isLogged, doctorController.getIndex);

router.get('/get-images', authController.isLogged, authController.isDoctor, doctorController.getImages)

router.get('/get-images-by-date', authController.isLogged, authController.isDoctor, doctorController.getImagesByDate)
// router.get('/get-images', doctorController.getImages)

router.get('/get-selected-dates', authController.isLogged, authController.isDoctor, doctorController.getSelectedDates)

router.post('/save-diagnostic', authController.isLogged, authController.isDoctor, doctorController.saveDiagnostic);

router.post('/write-log', doctorController.writeLog);

module.exports = router;