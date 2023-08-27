const express = require('express');
const route = express.Router();
const courseController = require('../controllers/courseController');
const authorize = require('../middlewares/authorization');

route.post('/course', authorize(['lecturer']), courseController.createCourse);
route.get('/course',courseController.readCourse);
route.get('/course/:id',courseController.getCourseById);
route.put('/course/:id', authorize(['lecturer']), courseController.updateCourse);
route.delete('/course/:id',authorize(['lecturer']), courseController.deleteCourse);

module.exports = route;