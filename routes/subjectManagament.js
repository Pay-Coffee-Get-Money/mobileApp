const express = require('express');
const route = express.Router();
const subjectController = require('../controllers/subjectController');
const authorize = require('../middlewares/authorization');

route.post('/subject', authorize(['lecturer']), subjectController.createSubject);
route.get('/subject', subjectController.readSubject);
route.get('/subject/:id', subjectController.getSubjectById);
route.put('/subject/:id', authorize(['lecturer']), subjectController.updateSubject);
route.delete('/subject/:id', authorize(['lecturer']), subjectController.deleteSubject);
route.get('/subject/students/:subjectId',subjectController.getStudentsInSubject);

module.exports = route;