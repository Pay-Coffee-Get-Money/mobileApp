const express = require('express');
const route = express.Router();
const deadlineController = require('../controllers/deadlineController');
const authorize = require('../middlewares/authorization');

route.post('/deadline/:subjectId', authorize(['lecturer']), deadlineController.createDeadline); //Cần post lên bao gồm: nameDeadline(string),deadline(dateTime),type(String): group/subject/topic/topic_review
route.get('/deadline/:subjectId', deadlineController.readDeadline);
route.put('/deadline/:deadlineId', authorize(['lecturer']), deadlineController.updateDeadline);
route.delete('/deadline/:deadlineId', authorize(['lecturer']), deadlineController.deleteDeadline);

module.exports = route;