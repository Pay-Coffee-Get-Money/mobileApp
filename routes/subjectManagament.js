const express = require('express');
const route = express.Router();
const subjectController = require('../controllers/subjectController');

route.post('/subject/create', subjectController.createSubject);
route.get('/subject', subjectController.readSubject);
route.get('/subject/getSubjectById', subjectController.getSubjectById);
route.put('/subject/update', subjectController.updateSubject);
route.delete('/subject/delete', subjectController.deleteSubject);

module.exports = route;