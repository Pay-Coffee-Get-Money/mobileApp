const express = require('express');
const route = express.Router();
const academicYearController = require('../controllers/academicYearController');

route.post('/academic_year',academicYearController.createAcademicYear);
route.get('/academic_year',academicYearController.readAcademicYear);
route.get('/academic_year/:id',academicYearController.getAcademicYearById);
route.put('/academic_year/:id',academicYearController.updateAcademicYear);
route.delete('/academic_year/:id',academicYearController.deleteAcademicYear);

module.exports = route;