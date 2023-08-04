const express = require('express');
const route = express.Router();
const specializationController = require('../controllers/specializationController');

route.post('/specialization', specializationController.createSpecialization);
route.get('/specialization', specializationController.readSpecialization);
route.get('/specialization/:id', specializationController.getSpecializationById);
route.put('/specialization/:id', specializationController.updateSpecialization);
route.delete('/specialization/:id', specializationController.deleteSpecialization);

module.exports = route;