const express = require('express');
const route = express.Router();
const groupController = require('../controllers/groupController');

route.post('/group', groupController.createGroup);
route.get('/group',groupController.readGroup);
route.get('/group/:id',groupController.getGroupById);
route.put('/group/:id',groupController.updateGroup);
route.delete('/group/:id',groupController.deleteGroup);

module.exports = route;