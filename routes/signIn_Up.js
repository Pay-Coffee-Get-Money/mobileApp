const express = require('express');
const route = express.Router();
const signIn_UpController = require('../controllers/signIn_UpController');

route.post('/signUp',signIn_UpController.signUp);
route.post('/signIn',signIn_UpController.signIn);
route.post('/signIn/google',signIn_UpController.signInWithGoogle);
route.post('/signIn/forgotPassword',signIn_UpController.forgotPassword);

module.exports = route;