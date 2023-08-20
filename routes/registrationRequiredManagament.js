const express = require('express');
const route = express.Router();
const registrationRequiredController = require('../controllers/registrationRequiredController');

route.post('/registration_required/:type/:userId/:id',registrationRequiredController.createRequired);       // Với type là loại yêu cầu group/subject và id là groupId/subjectId
route.get('/registration_required',registrationRequiredController.readRequired);
route.get('/registration_required/:id',registrationRequiredController.getRequiredById); 
route.delete('/registration_required/:idRequest',registrationRequiredController.deleteRequired);
route.put('/registration_required/:idRequest/:isApproved',registrationRequiredController.requireHandle); //isApproved mang giá trị true hoặc false

module.exports = route;