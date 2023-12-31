const userModel = require('../models/userModel');
const enrollStudent = require('../models/enrollStudent ');

const userController = {
    async readUser(req,res){
        try{
            const data = await userModel.readUser();
            res.json(data);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    },
    async updateUser(req,res){
        try{
            const id = req.params.id;
            const newUserInfors = req.body;
            const result = await userModel.updateUser(id,newUserInfors);
            res.json(result);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    },
    async deleteUser(req,res){
        try{
            const Id = req.params.id;
            const result = await userModel.deleteUser(Id);
            res.json(result);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    },
    async getUserById(req,res){
        try{
            const userId = req.params.id;
            const result = await userModel.getUserById(userId);
            res.json(result);
        }catch(e){
            res.json({code:err.code,message:err.details});
        }
    },
    async group_subject_topic_adding(req,res){
        try{
            const path = req.url;
            let pathParts = path.split('/');
            pathParts.shift();
            const result = await enrollStudent.group_subject_topic_adding(pathParts);
            res.json(result);
        }catch (err){
            res.json({code: err.code, message: err.details}); 
        }

    },
    async group_subject_topic_deleting(req,res){
        try{
            const path = req.url;
            let pathParts = path.split('/');
            pathParts.shift();
            const result = await enrollStudent.group_subject_topic_deleting(pathParts);
            res.json(result);
        }catch (err){
            res.json({code: err.code, message: err.details}); 
        }

    },
    async addListUserToSubject(req,res){
        const data = req.body;
        const result = await userModel.addListUserToSubject(data);
        res.json(result);
    },
    async addListUserToGroup(req,res){
        const data = req.body;
        const result = await userModel.addListUserToGroup(data);
        res.json(result);
    },
    async getSubjects(req,res){
        const userId = req.params.userId;
        const result = await userModel.getSubjects(userId);
        res.json(result);
    },
    async getTopics(req,res){
        const userId = req.params.userId;
        const result = await userModel.getTopics(userId);
        res.json(result);
    },
    async getGroups(req,res){
        const userId = req.params.userId;
        const result = await userModel.getGroups(userId);
        res.json(result);
    }
}

module.exports = userController;