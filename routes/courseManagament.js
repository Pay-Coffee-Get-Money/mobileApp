const express = require('express');
const route = express.Router();
const courseController = require('../controllers/courseController');

route.post('/course/create',courseController.createCourse);
route.get('/course',courseController.readCourse);
route.get('/course/getCourseById',courseController.getCourseById);
route.put('/course/update',courseController.updateCourse);
route.delete('/course/delete',courseController.deleteCourse);

module.exports = route;