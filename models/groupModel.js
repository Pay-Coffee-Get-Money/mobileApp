const {db} = require('../config');
const qrHandler = require('../src/qrCode/qrHandler');
const enrollStudent = require("./enrollStudent ");

const groupModel = {
    async createGroup(groupInfors){
        try{
            const docRef = await db.collection("groups").doc();         // Tạo tài liệu mới và lấy tham chiếu
            const docId = docRef.id;                                    // Lấy ID của tài liệu vừa tạo
            const groupQr = await qrHandler.createQR(docId);            // Tạo mã QR từ groupID 
            if(groupQr.code == 1){                                      // Kiểm tra có lỗi trong quá trình tạo QR hay không
                return {code: groupQr.code, message: "There was an error while generating the group QR code, please try again"};
            }else{
                const result = await docRef.set({...groupInfors, groupQr}); // Đặt dữ liệu cho tài liệu bao gồm mã QR
                //Sau khi tạo dọc group có chứa accountid của tài khoản sinh viên tạo group
                //Đồng thời thêm sinh viên vào group luôn
                const rs = enrollStudent.group_subject_topic_adding(["group",groupInfors.account_id,docId]);
                return {code: 0, message: "Successfully create group"};
            }
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async readGroup(){
      try{
        const query = db.collection("groups");
        const result = await query.get();
        const data = [];

        for (const item of result.docs) {
            //Trả thêm thông tin muôn học của group đó
            const subjectId = item.data().subjectId;
            const subjectModel = require('./subjectModel');
            const subjectInfors = await subjectModel.getSubjectById(subjectId);
            data.push({id: item.id, ...item.data(), subjectInfors});
        }
        
        return data;
      }catch(err){
        return {code: err.code, message: err.details};
      }
    },
    async updateGroup(groupId, newGroupInfors){
        try{
            if(await this.checkExistGroup(groupId)){
                const query = db.collection("groups").doc(groupId);
                const result = await query.update(newGroupInfors);
                return {code: 0, message: "Successfully update group"}; 
            }
            return {code: "Group updating error", message: "Group does not exist"}; 
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async deleteGroup(groupId){
        try{
            const query = db.collection("groups").doc(groupId)
            const result = await query.delete();
            return {code: 0, message: "Successfully delete group"}; 
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async getGroupById(groupId){
        try{
            const query = db.collection("groups").doc(groupId);
            const result = await query.get();
            //Trả thêm thông tin muôn học của group đó
            const subjectId = result.data().subjectId;
            const subjectModel = require('./subjectModel');
            const subjectInfors = await subjectModel.getSubjectById(subjectId);
            if(result.data() != null && subjectInfors){
                return {id: groupId, ...result.data(), subjectInfors}; 
            }
            return {code: "Group reading error", message: "Group does not exist"}; 
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async checkExistGroup(id){                           //Hàm kiểm tra group có tồn tại hay không bằng cách sử dụng groupID
        const query = db.collection("groups").doc(id);
        const result = await query.get();
        if(result.exists){
            return true;
        }
        return false;
    },
    async getStudentsInGroup(groupId){
        try{
            const userModel = require('./userModel');
            const listUser = await userModel.readUser(); //Lấy danh sách tất cả các user
            const listUser_In_Group = listUser.filter((user) => {    //Trả về mảng chứa danh sách sinh viên có tham gia group này
                if(user.groupIds && user.groupIds.length > 0 && user.groupIds.includes(groupId)){    //Kiểm tra trong mảng id các group user đang tham gia có id group đang cần lấy danh sách sv hay không
                    return user;
                }
            })
            return listUser_In_Group;
        }catch(err){
            return {code: "Subject error", msg: "An error occurred during processing"};
        }
    },
    async sendFindMembers(subjectId,groupId){
        try{
            const subjectModel = require('./subjectModel');
            const listStudentInSubject = await subjectModel.getStudentsInSubject(subjectId);
            const listStudentEmailInSubject = listStudentInSubject.map(user => user.email);
        }catch(err){
            return {code: "Subject error", msg: "An error occurred during processing"};
        }
    }
}

module.exports = groupModel;
