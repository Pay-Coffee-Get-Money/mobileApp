const express = require('express');
const route = express.Router();
const processController = require('../controllers/processController');

route.put('/process/:id',processController.updateProcess);

module.exports = route;