const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController');

route.get('/user',userController.readUser);
route.get('/user/:id',userController.getUserById);
route.put('/user/:id',userController.updateUser);
route.delete('/user/:id',userController.deleteUser);
route.put('/user/:type/:userId/:groupId_or_subjectId_or_topicId',userController.group_subject_topic_adding); //với id là id của group user muốn tham gia hoặc id của group user đã tạo group mới
route.delete('/user/:type/:userId/:groupId_or_subjectId_or_topicId',userController.group_subject_topic_deleting);
route.put('/users/subject',userController.addListUserToSubject); //put lên gồm subjectId và list_userId
module.exports = route;