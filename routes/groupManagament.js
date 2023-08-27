const express = require('express');
const route = express.Router();
const groupController = require('../controllers/groupController');
const authorize = require('../middlewares/authorization');

route.post('/group', authorize(['lecturer']), groupController.createGroup);
route.get('/group',groupController.readGroup);
route.get('/group/:id',groupController.getGroupById);
route.put('/group/:id',groupController.updateGroup);
route.delete('/group/:id', authorize(['lecturer']), groupController.deleteGroup);
route.get('/group/students/:groupId',groupController.getStudentsInGroup);
route.post('/group/find_members/:groupId/:subjectId', authorize(['lecturer']), groupController.sendFindMembers);

module.exports = route;