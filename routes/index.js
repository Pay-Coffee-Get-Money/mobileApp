const express = require('express');
const route = express.Router();
const UserControllers = require('../controllers/UserController');

route.post('/signUp',UserControllers.signUp);
route.post('/signIn',UserControllers.signIn);
route.post('/signIn/google',UserControllers.signInWithGoogle);

module.exports = route;