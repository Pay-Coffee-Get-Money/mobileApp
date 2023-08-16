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
    }
}

module.exports = topicController;