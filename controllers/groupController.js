const groupModel = require('../models/groupModel');

const groupController = {
    async createGroup(req,res){
        try{
            const groupInfors = req.body;
            const result = await groupModel.createGroup(groupInfors);       
            res.json(result);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async readGroup(req,res){
        try{
            const data = await groupModel.readGroup();
            res.json(data);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async updateGroup(req,res){
        try{
            const id = req.params.id;
            const newGroupInfors = req.body;
            const result = await groupModel.updateGroup(id, newGroupInfors);
            res.json(result);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async deleteGroup(req,res){
        try{
            const groupId = req.params.id;
            const result = await groupModel.deleteGroup(groupId);
            res.json(result);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async getGroupById(req,res){
        try{
            const groupId = req.params.id;
            const result = await groupModel.getGroupById(groupId);
            res.json(result);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async getStudentsInGroup(req,res){
        try{
            const groupId = req.params.groupId;     // lấy id group cần xem danh sách sinh viên
            const result = await groupModel.getStudentsInGroup(groupId);
            res.json(result);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async sendFindMembers(req,res){
        const subjectId = req.params.subjectId;
        const groupId = req.params.groupId;
        const result = await groupModel.sendFindMembers(subjectId,groupId);
        res.json(result);
    }
}

module.exports = groupController;