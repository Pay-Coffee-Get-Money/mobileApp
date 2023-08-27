const express = require('express');
const route = express.Router();
const notificationController = require('../controllers/notificationController');
const authorize = require('../middlewares/authorization');

route.post('/notify', authorize(['lecturer']), notificationController.createNotify);  //Phải có trường title(string),content(string)
route.get('/notify',notificationController.readNotify);
route.get('/notify/:id',notificationController.getNotifyById); 
route.put('/notify/:id', authorize(['lecturer']), notificationController.updateNotify);
route.delete('/notify/:id', authorize(['lecturer']), notificationController.deleteNotify);

module.exports = route;