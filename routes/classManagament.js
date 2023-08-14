const express = require('express');
const route = express.Router();
const classController = require('../controllers/classController');

route.post('/class', classController.createClass);
route.get('/class', classController.readClass);
route.get('/class/:id', classController.getClassById);
route.put('/class/:id', classController.updateClass);
route.delete('/class/:id', classController.deleteClass);

module.exports = route;