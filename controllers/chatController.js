const chatModel = require('../models/chatModel');

const chatController = {
    async getChatRoomBySubjectId(req,res){
        const subjectId = req.params.subjectId;
        const result = await chatModel.getChatRoomBySubjectId(subjectId);
        res.json(result);
    },
    async sendMsg(req,res){
        const subjectId = req.params.subjectId;
        const userId = req.params.userId;
        const msg = req.body.msg;
        const result = await chatModel.sendMsg(subjectId,userId,msg);
        res.json(result);
    }
}

module.exports = chatController;