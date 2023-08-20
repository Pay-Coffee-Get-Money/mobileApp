const express = require('express');
const route = express.Router();
const deadlineController = require('../controllers/deadlineController');

route.post('/deadline/:subjectId', deadlineController.createDeadline); //Cần post lên bao gồm: nameDeadline(string),deadline(dateTime),type(String): group/subject/topic/topic_review
route.get('/deadline/:subjectId', deadlineController.readDeadline);
route.put('/deadline/:deadlineId', deadlineController.updateDeadline);
route.delete('/deadline/:deadlineId', deadlineController.deleteDeadline);

module.exports = route;