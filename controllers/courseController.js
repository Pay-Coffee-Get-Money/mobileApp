const courseModel = require('../models/courseModel');

const courseController = {
    async createCourse(req,res){
        try{
            const courseInfors = req.body;
            const result = await courseModel.createCourse(courseInfors);
            res.json(result);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    },
    async readCourse(req,res){
        try{
            const data = await courseModel.readCourse();
            res.json(data);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    },
    async updateCourse(req,res){
        try{
            const newCourseInfors = req.body;
            const id = req.params.id;
            const result = await courseModel.updateCourse(id,newCourseInfors);
            res.json(result);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    },
    async deleteCourse(req,res){
        try{
            const courseId = req.params.id;
            const result = await courseModel.deleteCourse(courseId);
            res.json(result);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    },
    async getCourseById(req,res){
        try{
            const courseId = req.params.id;
            const result = await courseModel.getCourseById(courseId);
            res.json(result);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    }
}

module.exports = courseController;