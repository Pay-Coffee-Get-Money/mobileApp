const userModel = require('../models/userModel');
const enrollStudent = require('./enrollStudent ');

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
    async group_subject_Handler(req,res){
        try{
            const path = req.url;
            let pathParts = path.split('/');
            pathParts.shift();
            const result = await enrollStudent.add_To_GroupOrSubject(pathParts);
            res.json(result);
        }catch (err){
            res.json({code: err.code, message: err.details}); 
        }

    }
}

module.exports = userController;