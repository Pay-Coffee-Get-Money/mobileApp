const specializationModel = require('../models/specializationModel');

const specializationController = {
    async createSpecialization(req,res){
        try{
            const infors = req.body;
            const result = await specializationModel.createSpecialization(infors);
            res.json(result);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async readSpecialization(req,res){
        try{
            const data = await specializationModel.readSpecialization();
            res.json(data);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async updateSpecialization(req,res){
        try{
            const id = req.params.id;
            const newInfors = req.body;
            const result = await specializationModel.updateSpecialization(id, newInfors);
            res.json(result);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async deleteSpecialization(req,res){
        try{
            const Id = req.params.id;
            const result = await specializationModel.deleteSpecialization(Id);
            res.json(result);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    },
    async getSpecializationById(req,res){
        try{
            const Id = req.params.id;
            const result = await specializationModel.getSpecializationById(Id);
            res.json(result);
        }catch(err){
            res.json({code: err.code, message: err.details});
        }
    }
}

module.exports = specializationController;