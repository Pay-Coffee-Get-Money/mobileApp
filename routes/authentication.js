const express = require('express');
const route = express.Router();
const authenticationController = require('../controllers/authenticationController');

route.post('/signUp',authenticationController.signUp);
route.post('/signIn',authenticationController.signIn);
route.post('/signIn/google',authenticationController.signInWithGoogle);
route.post('/signIn/forgotPassword',authenticationController.forgotPassword);

module.exports = route;