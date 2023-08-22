const termModel = require('../models/termModel');

const termController = {
    async createTerm (req,res){
        const termInfors = req.body;
        console.log(termInfors)
        const result = await termModel.createTerm(termInfors);
        res.json(result);
    },
    async readTerm (req,res){
        const data = await termModel.readTerm();
        res.json(data);
    },
    async updateTerm (req,res){
        const newTermInfors = req.body;
        const id = req.params.id;
        const result = await termModel.updateTerm(id,newTermInfors);
        res.json(result);
    },
    async deleteTerm(req, res) {
        const id = req.params.id;
        const result = await termModel.deleteTerm(id);
        res.json(result);
    },
    async getTermById(req, res) {
        const id = req.params.id;
        const result = await termModel.getTermById(id);
        res.json(result);
    }
}

module.exports = termController;