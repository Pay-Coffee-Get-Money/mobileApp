const express = require('express');
const route = express.Router();
const academicYearController = require('../controllers/academicYearController');
const authorize = require('../middlewares/authorization');

route.post('/academic_year', authorize(['lecturer']), academicYearController.createAcademicYear);
route.get('/academic_year',academicYearController.readAcademicYear);
route.get('/academic_year/:id',academicYearController.getAcademicYearById);
route.put('/academic_year/:id', authorize(['lecturer']), academicYearController.updateAcademicYear);
route.delete('/academic_year/:id', authorize(['lecturer']), academicYearController.deleteAcademicYear);

module.exports = route;