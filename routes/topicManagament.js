const express = require('express');
const route = express.Router();
const topicController = require('../controllers/topicController');

route.post('/topic',topicController.createTopic);
route.get('/topic',topicController.readTopic);
route.get('/topic/:id',topicController.getTopicById);
route.put('/topic/:id',topicController.updateTopic);
route.delete('/topic/:id',topicController.deleteTopic);

module.exports = route;