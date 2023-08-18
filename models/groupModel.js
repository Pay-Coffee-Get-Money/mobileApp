const {db} = require('../config');
const qrHandler = require('../src/qrCode/qrHandler');

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
        result.forEach((item) => {
            data.push({id: item.id, ...item.data()});
        })
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
            if(result.data() != null){
                return {id: groupId, ...result.data()}; 
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
    }
}

module.exports = groupModel;