const express = require('express');
const route = express.Router();
const chatController = require('../controllers/chatController');

route.post('/chat/:subjectId',chatController.createChatRoom);
route.post('/chat/:chatRoomId/:userId/',chatController.sendMsg);     //Gửi tin nhắn 
route.get('/chat/:subjectId/:userId',chatController.getAllChatRoomsInSubject);              //Lấy danh sách các phòng chat của môn học mà user có tham gia
module.exports = route;