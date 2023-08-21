const registrationRequiredModel = require('../models/registrationRequiredModel');

const registrationRequiredController = {
    async createRequired(req,res){
        const type = req.params.type;
        const id = req.params.id;
        const userId = req.params.userId;

        const result = await registrationRequiredModel.createRequired(type, userId, id);
        res.json(result);
    },
    async readRequired(req,res){
        const result = await registrationRequiredModel.readRequired();
        res.json(result);
    },
    async deleteRequired(req,res){
        const id = req.params.idRequest;
        const result = await registrationRequiredModel.deleteRequired(id);
        res.json(result);
    },
    async getRequiredById(req,res){
        const id = req.params.id;
        const result = await registrationRequiredModel.getRequiredById(id);
        res.json(result);
    },
    async requireHandle(req,res){
        const id = req.params.idRequest;
        const isApproved = req.params.isApproved;
        const result = await registrationRequiredModel.requireHandle(id,isApproved);
        res.json(result);
    }
}

module.exports = registrationRequiredController;