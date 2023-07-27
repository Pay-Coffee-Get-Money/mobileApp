const termModel = require('../models/termModel');

const termController = {
    async createTerm (req,res){
        const termInfors = req.body;
        const result = await termModel.createTerm(termInfors);
        res.send(result);
    },
    async readTerm (req,res){
        const data = await termModel.readTerm();
        res.send(data);
    },
    async updateTerm (req,res){
        const {id,...newTermInfors} = req.body;
        const result = await termModel.updateTerm(id,newTermInfors);
        res.send(result);
    },
    async deleteTerm(req, res) {
        const id = req.body.id;
        const result = await termModel.deleteTerm(id);
        res.send(result);
    },
    async getTermById(req, res) {
        const id = req.body.id;
        const result = await termModel.getTermById(id);
        res.send(result);
    }
}

module.exports = termController;