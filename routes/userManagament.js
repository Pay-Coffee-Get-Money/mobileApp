const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController');

route.get('/user',userController.readUser);
route.get('/user/:id',userController.getUserById);
route.put('/user/:id',userController.updateUser);
route.delete('/user/:id',userController.deleteUser);
route.put('/user/:type/:userId/:groupId_or_subjectId',userController.group_subject_Handler); //với id là id của group user muốn tham gia hoặc id của group user đã tạo group mới

module.exports = route;