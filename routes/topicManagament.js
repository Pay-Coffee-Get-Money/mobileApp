const express = require('express');
const route = express.Router();
const topicController = require('../controllers/topicController');
const upload = require('../src/multerConfig/multerConfig');

route.post('/topic',topicController.createTopic);  //Phải có trường name(string),subjectId(string)
route.get('/topic',topicController.readTopic);
route.get('/topic/:id',topicController.getTopicById);
route.put('/topic/:id',topicController.updateTopic);
route.delete('/topic/:id',topicController.deleteTopic);
route.get('/topic/students/:topicId',topicController.getStudentsInTopic);
route.get('/topic/statistics/:subjectId',topicController.getStatistics);  //Tạo biểu đồ thống kê tình hình đăng ký đề tài của 1 môn học

route.post('/topic/files_submit/:subjectId',                   //Nộp bài
    upload.single("file"),  
    topicController.submitTopicFile 
)

route.get('/topic/files_submit/:subjectId',                     //Lấy ds bài nộp của các đề tài trong môn học
    topicController.readTopicFilesSubmit
)

route.get('/topic/files_submit/file/:idFileSubmit',                  //Taỉ bài nộp củ
    topicController.downloadFilesSubmit
)

route.put('/topic/files_submit/:idFileSubmit/:mark',topicController.markFilesSubmit);          //chấm điểm cho bài nộp         

module.exports = route;