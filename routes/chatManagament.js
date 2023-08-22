const express = require('express');
const route = express.Router();
const chatController = require('../controllers/chatController');

route.post('/chat/:subjectId/:userId/',chatController.sendMsg);     //Gửi tin nhắn trong group của môn học
route.get('/chat/:subjectId',chatController.getChatRoomBySubjectId);              //Lấy thông tin phòng chat của môn học
module.exports = route;