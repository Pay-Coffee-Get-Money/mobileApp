const express = require('express');
const route = express.Router();
const courseController = require('../controllers/courseController');

route.post('/course',courseController.createCourse);
route.get('/course',courseController.readCourse);
route.get('/course/:id',courseController.getCourseById);
route.put('/course/:id',courseController.updateCourse);
route.delete('/course/:id',courseController.deleteCourse);

module.exports = route;