const notificationModel = require('../models/notificationModel');
const {admin} = require('../config');

const notificationController = {
    async createNotify(req,res){
        const infors =  req.body;
        const result = await notificationModel.createNotify(infors);
        res.json(result);
    },
    async readNotify(req,res){
        const result = await notificationModel.readNotify();
        res.json(result);
    },
    async getNotifyById(req,res){
        const id = req.params.id;
        const result = await notificationModel.getNotifyById(id);
        res.json(result);
    },
    async updateNotify(req,res){
        const id = req.params.id;
        const newInfors = req.body;
        const result = await notificationModel.updateNotify(id,newInfors);
        res.json(result);
    },
    async deleteNotify(req,res){
        const id = req.params.id;
        const result = await notificationModel.deleteNotify(id);
        res.json(result);
    },
}

module.exports = notificationController;  