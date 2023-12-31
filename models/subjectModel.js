const { name } = require('ejs');
const {db} = require('../config.js');

const subjectModel = {
    async createSubject(subjectInfors){
        try{
            //Xử lý bất đồng bộ sau khi thêm doc vào collection database
            //Nếu thêm thành công thì trả về code 0
            //Thât bại về thông tin lỗi
            const ref = await db.collection('subjects').doc();
            const result = await ref.set(subjectInfors);
            //Tạo chatRoom cho môn học
            const chatModel = require('./chatModel.js');
            const chatRoom = await chatModel.createChatRoom(ref.id);
            return {code:0, message:`Successfully create subject: ${subjectInfors['name']}`};
        }catch(err){
            return {code:err.code, message:err.message};
        }
    },
    async readSubject() {
        try {
            const query = db.collection('subjects');
            const result = await query.get();
            const termPromises = []; // Mảng chứa các promise
            const data = [];
        
            result.forEach((item) => {
                const subjectInfors = item.data();
                
                // Lấy thông tin học kỳ
                if (subjectInfors.termId) {
                    const termModel = require('./termModel.js');
                    const termPromise = termModel.getTermById(subjectInfors.termId);
                    termPromises.push(termPromise);
                }
        
                const idSubject = item.id;
                data.push({ id: idSubject, ...subjectInfors });
            });
        
            // Chờ tất cả các promise hoàn thành
            const termResults = await Promise.all(termPromises);
        
            // Gán kết quả của promise vào mảng data
            termResults.forEach((term, index) => {
                if (term) {
                    data[index].term = term;
                } else {
                    data[index].term = {};
                }
            });
        
            return data;
        } catch (err) {
            console.log(err);
            return { code: "Subject reading err", message: "An error occurred during the read process" };
        }        
    },    
    async updateSubject(id,newSubjectInfors){
        try{
            //Dùng hàm kiểm tra môn học với id môn học được gửi lên từ phía client 
            //có tồn tại hay không 
            //nếu tồn tại mới tiếp tục thực hiện update
            //nếu không tồn tại trả về lỗi
            const checkEx = await subjectModel.checkExistSubject(id);
            if(checkEx){
                const query = db.collection('subjects').doc(id);
                //xử lý bất đồng bộ kết quả sau khi thực hiện update
                //nếu thành công trả về code 0
                const result = await query.update(newSubjectInfors);
                return {code:0, message:"Update successful"};
            }
            return {code:"Subject updating err", message:"Subject does not exist"};
        }catch(err){
            return {code:"Subject updating err", message:"An error occurred during the update process"};
        }
    },
    async deleteSubject(id){
        try{
            //Dùng hàm kiểm tra môn học với id môn học được gửi lên từ phía client 
            //có tồn tại hay không 
            //nếu tồn tại mới tiếp tục thực hiện delete
            //nếu không tồn tại trả về lỗi
            const checkEx = await subjectModel.checkExistSubject(id);
            if(checkEx){
                const query = db.collection("subjects").doc(id);
                //Xử lý bất đồng bộ kết quả trả về sau khi xóa 
                //Nếu xóa thành công trả về code 0
                const result = await query.delete();
                return {code:0, message:"Delete successful"};
            }
            return {code:"Subject deleting err", message:"Subject does not exist"};
        }catch(err){
            return {code:"Subject deleting err", message:"An error occurred during the delete process"};
        }
    },
    async getSubjectById(id){
        try{
            const query = db.collection("subjects").doc(id);
            //Xử lý bất đồng bộ kết quả trả về sau khi thực hiện tìm kiếm term bằng subjectID
            //Nếu kết quả trả về tồn tại term 
            //sẽ xuất thông tin subject đó trả về phía client
            const result = await query.get();
            if(result.exists){
                return {id,...result.data()};
            }
            return {code:"Subject reading err", message:"Subject does not exist"}; 
        }catch(e){
            return {code:"Subject getting err", message:"An error occurred during the get process"};
        }
    },
    async checkExistSubject(id){                           //Hàm kiểm tra Subject có tồn tại hay không bằng cách sử dụng subjectID
        const query = db.collection("subjects").doc(id);
        const result = await query.get();
        if(result.exists){
            return true;
        }
        return false;
    },
    async getStudentsInSubject(subjectId){
        try{
            const userModel = require('./userModel');
            const listUser = await userModel.readUser(); //Lấy danh sách tất cả các user
            const listUser_In_Subject = listUser.filter((user) => {    //Trả về mảng chứa danh sách sinh viên có tham gia môn học này
                if(user.subjectIds && user.subjectIds.length > 0 && user.subjectIds.includes(subjectId)){    //Kiểm tra trong mảng id các môn học user đang tham gia có id môn học đang cần lấy danh sách sv hay không
                    return user;
                }
            })
            return listUser_In_Subject;
        }catch(err){
            return {code: "Subject error", msg: "An error occurred during processing"};
        }
    }
}

module.exports = subjectModel;