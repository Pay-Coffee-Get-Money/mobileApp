const express = require('express');
const route = express.Router();
const processController = require('../controllers/processController');
const authorize = require('../middlewares/authorization');

route.put('/process/:id', authorize(['lecturer']), processController.updateProcess);

module.exports = route;