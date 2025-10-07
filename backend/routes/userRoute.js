const express = require('express');
const router = express.Router();

const controller = require('../controllers/userControl.js');
const { validateUserRegistration, validateUserLogin } = require('../validators/userValidator');

router.post('/register', validateUserRegistration, controller.registerUser);
router.post('/login', validateUserLogin, controller.loginUser);

module.exports = router;