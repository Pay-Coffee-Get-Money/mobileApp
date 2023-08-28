const chatModel = require('../models/chatModel');

const chatController = {
    async getAllChatRoomsInSubject(req,res){
        const subjectId = req.params.subjectId;
        const userId = req.params.userId;
        const result = await chatModel.getAllChatRoomsInSubject(subjectId,userId);
        res.json(result);
    },
    async sendMsg(req,res){
        const chatRoomId = req.params.chatRoomId;
        const userId = req.params.userId;
        const msg = req.body.msg;
        const result = await chatModel.sendMsg(chatRoomId,userId,msg);
        res.json(result);
    },
    async createChatRoom(req,res){
        const subjectId = req.params.subjectId;
        const userIds = req.body.userIds;
        const rs = await chatModel.createChatRoom(subjectId,userIds);
        if(rs.code !== 1){
            res.json({ code: 0, msg: 'Chat room success created' });
        }else{
            res.json(rs);
        }   
    }
}

module.exports = chatController;