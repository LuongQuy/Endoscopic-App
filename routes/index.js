const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');
const signUpController = require('../controllers/signupController');
const authController = require('../controllers/authController');
const doctorController = require('../controllers/doctor/doctorController')

router.get('/', (req, res) => res.redirect('/login'))

/* GET home page. */
router.get('/login', authController.notLogged, loginController.getLogin);
router.post('/login', authController.notLogged, loginController.postLogin);

router.get('/logout', loginController.getLogout);

router.get('/add-images', doctorController.add_image)

router.get('/get-images', doctorController.getImages)

router.get('/sign-up', authController.notLogged, signUpController.getSignUp);
router.post('/sign-up', authController.notLogged, signUpController.postSignUp);

// router.get('/logout', loginController.getLogout);

module.exports = router;