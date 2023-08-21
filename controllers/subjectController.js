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
        const newSubjectInfors = req.body;
        const id = req.params.id;
        const result = await subjectModel.updateSubject(id,newSubjectInfors);
        res.json(result);
    },
    async deleteSubject(req, res) {
        const id = req.params.id;
        const result = await subjectModel.deleteSubject(id);
        res.json(result);
    },
    async getSubjectById(req, res) {
        const id = req.params.id;
        const result = await subjectModel.getSubjectById(id);
        res.json(result);
    },
    async getStudentsInSubject(req,res){
        try{
            const subjectId = req.params.subjectId;     // lấy id môn học cần xem danh sách sinh viên
            const result = await subjectModel.getStudentsInSubject(subjectId);
            res.json(result);
        }catch(err){
            res.json({code: "Subject error", msg: "An error occurred during processing"});
        }
    },
    async createSubjectDeadline(req,res){
        const nameDeadline = req.body.nameDeadline;
        const deadline = req.body.deadline;
        const result = await subjectModel.createSubjectDeadline(nameDeadline,deadline);
        return result;
    }
}

module.exports = subjectController;