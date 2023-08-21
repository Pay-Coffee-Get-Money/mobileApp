const deadlineModel = require('../models/deadlineModel');

const deadlineController = {
    async createDeadline(req,res){
        try{
            const subjectId = req.params.subjectId;
            const deadlineInfors = req.body;
            const result = await deadlineModel.createDeadline({subjectId, ...deadlineInfors});
            res.json(result);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async readDeadline(req,res){
        try{
            const subjectId = req.params.subjectId;
            const result = await deadlineModel.readDeadline(subjectId);
            res.json(result);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async updateDeadline(req,res){
        try{
            const id = req.params.deadlineId;
            const newInfors = req.body;
            const result = await deadlineModel.updateDeadline(id, newInfors);
            res.json(result);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async deleteDeadline(req,res){
        try{
            const id = req.params.deadlineId;
            const result = await deadlineModel.deleteDeadline(id);
            res.json(result);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    }
}

module.exports = deadlineController;