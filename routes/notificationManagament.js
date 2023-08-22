const express = require('express');
const route = express.Router();
const notificationController = require('../controllers/notificationController');

route.post('/notify',notificationController.createNotify);  //Phải có trường title(string),content(string)
route.get('/notify',notificationController.readNotify);
route.get('/notify/:id',notificationController.getNotifyById); 
route.put('/notify/:id',notificationController.updateNotify);
route.delete('/notify/:id',notificationController.deleteNotify);

module.exports = route;