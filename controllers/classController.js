const classModel = require('../models/classModel');

const classController = {
    async createClass(req,res){
        try{
            const classInfors = req.body;
            const result = await classModel.createGroup(classInfors);
            res.json(result);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async readClass(req,res){
        try{
            const data = await classModel.readClass();
            res.json(data);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async updateClass(req,res){
        try{
            const id = req.params.id;
            const newClassInfors = req.body;
            const result = await classModel.updateClass(id, newClassInfors);
            res.json(result);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async deleteClass(req,res){
        try{
            const classId = req.params.id;
            const result = await classModel.deleteClass(classId);
            res.json(result);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async getClassById(req,res){
        try{
            const classId = req.params.id;
            const result = await classModel.getClassById(classId);
            res.json(result);
        }catch(e){
            res.json({code: err.code, message: err.details});
        }
    }
}

module.exports = classController;