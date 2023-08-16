const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController');

route.get('/user',userController.readUser);
route.get('/user/:id',userController.getUserById);
route.put('/user/:id',userController.updateUser);
route.delete('/user/:id',userController.deleteUser);

module.exports = route;