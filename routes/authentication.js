const express = require('express');
const route = express.Router();
const authenticationController = require('../controllers/authenticationController');

route.post('/signUp',authenticationController.signUp);
route.post('/signIn',authenticationController.signIn);
route.post('/signIn/:email',authenticationController.forgotPassword);
route.post('/signOut',authenticationController.signOut);

module.exports = route;