const academicYearModel = require('../models/academicYearModel');

const academicYearController = {
    async createAcademicYear(req,res){
        try{
            const academicYearInfors = req.body;
            const result = await academicYearModel.createAcademicYear(academicYearInfors);
            res.json(result);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    },
    async readAcademicYear(req,res){
        try{
            const data = await academicYearModel.readAcademicYear();
            res.json(data);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    },
    async updateAcademicYear(req,res){
        try{
            const id = req.params.id;
            const newInfors = req.body;
            const result = await academicYearModel.updateAcademicYear(id,newInfors);
            res.json(result);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    },
    async deleteAcademicYear(req,res){
        try{
            const Id = req.params.id;
            const result = await academicYearModel.deleteAcademicYear(Id);
            res.json(result);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    },
    async getAcademicYearById(req,res){
        try{
            const Id = req.params.id;
            const result = await academicYearModel.getAcademicYearById(Id);
            res.json(result);
        }catch(err){
            res.json({code:err.code,message:err.details});
        }
    }
}

module.exports = academicYearController;