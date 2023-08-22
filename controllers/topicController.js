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
    }
}

module.exports = topicController;