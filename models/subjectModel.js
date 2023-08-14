const {db} = require('../config.js');

const subjectModel = {
    async createSubject(subjectInfors){
        try{
            //Xử lý bất đồng bộ sau khi thêm doc vào collection database
            //Nếu thêm thành công thì trả về code 0
            //Thât bại về thông tin lỗi
            const result = await db.collection('subjects').doc().set({
                "code": subjectInfors['code'],
                "name": subjectInfors['name'],
                "credit": subjectInfors['credit'],
                "active": subjectInfors['active']
            })
            return {code:0, message:`Successfully create subject: ${subjectInfors['name']}`};
        }catch(err){
            return {code:err.code, message:err.message};
        }
    },
    async readSubject(){
        try{
            //Xử lý bất đồng bộ để lấy kết quả trả về từ database
            const query = db.collection('subjects');
            const result = await query.get();
            const data = [];
            //đưa các dữ liệu subjects vào mảng mới rồi trả về mảng sau khi thêm
            result.forEach((item) => {
                const idSubject = item.id;
                const {...subjectInfors} = item.data();
                data.push({id:idSubject, ...subjectInfors});
            });
            return data;
        }catch(err){
            return {code:"Subject reading err", message:"An error occurred during the read process"};
        }        
    },
    async updateSubject(id,newSubjectInfors){
        try{
            //Dùng hàm kiểm tra môn học với id môn học được gửi lên từ phía client 
            //có tồn tại hay không 
            //nếu tồn tại mới tiếp tục thực hiện update
            //nếu không tồn tại trả về lỗi
            const checkEx = await this.checkExistSubject(id);
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
            const checkEx = await this.checkExistSubject(id);
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
                return {id, subjectInfors:result.data()};
            }
            return {code:"Subject getting err", message:"Subject does not exist"}; 
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
    }
}

module.exports = subjectModel;