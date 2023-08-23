const topicModel = require('../models/topicModel');

const topicController = {
    async createTopic(req,res){
        try{
            const topicInfors = req.body;
            const result = await topicModel.createTopic(topicInfors);
            res.json(result);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    },
    async readTopic(req,res){
        try{
            const data = await topicModel.readTopic();
            res.json(data);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    },
    async updateTopic(req,res){
        try{
            const id = req.params.id;
            const newTopicInfors = req.body;
            const result = await topicModel.updateTopic(id,newTopicInfors);
            res.json(result);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    },
    async deleteTopic(req,res){
        try{
            const topicId = req.params.id;
            const result = await topicModel.deleteTopic(topicId);
            res.json(result);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    },
    async getTopicById(req,res){
        try{
            const topicId = req.params.id;
            const result = await topicModel.getTopicById(topicId);
            res.json(result);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    },
    async getStudentsInTopic(req,res){
        try{
            const topicId = req.params.topicId;     // lấy id topic cần xem danh sách sinh viên
            const result = await topicModel.getStudentsInTopic(topicId);
            res.json(result);
        }catch(err){
            res.json({code: "Subject error", msg: "An error occurred during processing"});
        }
    },
    async getStatistics(req,res){
        const subjectId = req.params.subjectId;
        const result = await topicModel.getStatistics(subjectId);
        res.sendFile(result);
    },
    async submitTopicFile(req,res){
        //Lấy tên file đã nộp
        const fileName = req.file.originalname;
        const partsFileName = fileName.split(/[._]/);
        const subjectId = req.subjectId;
        const userId = partsFileName[0];
        const topicId = partsFileName[1];
        const result = await topicModel.submitTopicFile(userId,topicId,subjectId,fileName);
        res.json(result);
    },
    async readTopicFilesSubmit(req,res){
        const subjectId = req.params.subjectId;
        const result = await topicModel.readTopicFilesSubmit(subjectId);
        res.json(result);
    },
    async downloadFilesSubmit(req, res) {
        const idFileSubmit = req.params.idFileSubmit;
        const filePath = await topicModel.downloadFilesSubmit(idFileSubmit);
        
        if (typeof filePath === 'string') {
            res.sendFile(filePath);
        } else {
            res.json(filePath);
        }
    },
    async markFilesSubmit(req,res){
        const mark = req.params.mark;
        const idFileSubmit = req.params.idFileSubmit;
        const result = await topicModel.markFilesSubmit(idFileSubmit,mark);
        res.json(result);

    }
}

module.exports = topicController;