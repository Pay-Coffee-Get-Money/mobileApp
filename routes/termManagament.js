const express = require('express');
const route = express.Router();
const termController = require('../controllers/termController');

route.post('/term/create',termController.createTerm);
route.get('/term',termController.readTerm);
route.get('/term/getTermById',termController.getTermById);
route.put('/term/update',termController.updateTerm);
route.delete('/term/delete',termController.deleteTerm);

module.exports = route;