const express = require('express');
const route = express.Router();
const termController = require('../controllers/termController');

route.post('/term',termController.createTerm);
route.get('/term',termController.readTerm);
route.get('/term/:id',termController.getTermById);
route.put('/term/:id',termController.updateTerm);
route.delete('/term/:id',termController.deleteTerm);

module.exports = route;