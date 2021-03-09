const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');
const signUpController = require('../controllers/signupController');
const authController = require('../controllers/authController');

router.get('/', (req, res) => res.redirect('/login'))

router.get('/login', authController.notLogged, loginController.getLogin);
router.post('/login', authController.notLogged, loginController.postLogin);

router.get('/logout', loginController.getLogout);

router.get('/sign-up', authController.notLogged, signUpController.getSignUp);
router.post('/sign-up', authController.notLogged, signUpController.postSignUp);

module.exports = router;