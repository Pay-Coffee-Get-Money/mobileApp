const express = require('express');
const route = express.Router();
const termController = require('../controllers/termController');
const authorize = require('../middlewares/authorization');

route.post('/term', authorize(['lecturer']), termController.createTerm);
route.get('/term',termController.readTerm);
route.get('/term/:id',termController.getTermById);
route.put('/term/:id', authorize(['lecturer']), termController.updateTerm);
route.delete('/term/:id', authorize(['lecturer']), termController.deleteTerm);

module.exports = route;