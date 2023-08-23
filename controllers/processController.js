const {db} = require('../config');
const processModel = require('../models/processModel');

const processController = {
    async updateProcess(req,res){
        const processId = req.params.id;
        const data = req.body;
        const result = await processModel.updateProcess(processId, data);
        res.json(result);
    }
}

module.exports = processController;