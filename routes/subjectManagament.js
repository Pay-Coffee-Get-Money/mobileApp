const express = require('express');
const route = express.Router();
const subjectController = require('../controllers/subjectController');

route.post('/subject', subjectController.createSubject);
route.get('/subject', subjectController.readSubject);
route.get('/subject/:id', subjectController.getSubjectById);
route.put('/subject/:id', subjectController.updateSubject);
route.delete('/subject/:id', subjectController.deleteSubject);
route.post('/subject/importExcel', upload.single("file"), subjectController.uploadExcel);
route.get('/subject/exportExcel', subjectController.exportExcel);

module.exports = route;