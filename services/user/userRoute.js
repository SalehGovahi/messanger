const express = require('express');
const router = express.Router();

const userMiddleware = require('./userMiddleware');
const userController = require('./userController');

router.get('/', userController.getUsers);

router.get('/:uid', userController.getUserById);

router.post('/signup', userMiddleware.validateSignUpBody, userController.signup);

router.post('/login', userMiddleware.validateLoginBody, userController.login);

module.exports = router;