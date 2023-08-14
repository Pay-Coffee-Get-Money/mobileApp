const subjectModel = require('../models/subjectModel');

const subjectController = {
    async createSubject (req,res){
        const subjectInfors = req.body;
        const result = await subjectModel.createSubject(subjectInfors);
        res.json(result);
    },
    async readSubject (req,res){
        const data = await subjectModel.readSubject();
        res.json(data);
    },
    async updateSubject (req,res){
        const {id,...newSubjectInfors} = req.body;
        const result = await subjectModel.updateSubject(id,newSubjectInfors);
        res.json(result);
    },
    async deleteSubject(req, res) {
        const id = req.body.id;
        const result = await subjectModel.deleteSubject(id);
        res.json(result);
    },
    async getSubjectById(req, res) {
        const id = req.body.id;
        const result = await subjectModel.getSubjectById(id);
        res.json(result);
    }
}

module.exports = subjectController;