const {db} = require('../config.js');

const termModel = {
    async createTerm(termInfors){
        try{
            //Xử lý bất đồng bộ sau khi thêm doc vào collection database
            //Nếu thêm thành công thì trả về code 0
            //Thât bại về thông tin lỗi
            const result = await db.collection('terms').doc().set({
                start_day: termInfors['start_day'] == "" ? "" : new Date(termInfors['start_day']),
                end_day: termInfors['start_day'] == "" ? "" : new Date(termInfors['end_day']),
                ...termInfors
            })
            return {code:0, message:`successfully create term: ${termInfors['name']}`};
        }catch(err){
            return {code:err.code, message:err.message};
        }
    },
    async readTerm(){
        try{
            //Xử lý bất đồng bộ để lấy kết quả trả về từ database
            const query = db.collection('terms');
            const result = await query.get();
            const data = [];
            //đưa các dữ liệu terms vào mảng mới rồi trả về mảng sau khi thêm
            const arrPromise = [];
            result.forEach((item) => {
                const idTerm = item.id;
                const termInfors = item.data();
                data.push({id:idTerm, termInfors});
                //Lấy academic_year
                const academicYearModel = require('./academicYearModel.js');
                const academic_year_id = item.data()['academic_year_id'];
                const academicYear = academicYearModel.getAcademicYearById(academic_year_id);
                console.log(termInfors)
                arrPromise.push(academicYear)
            });

            // Chờ tất cả các promise hoàn thành
            const Results = await Promise.all(arrPromise);

            // Gán kết quả của promise vào mảng data
            Results.forEach((item, index) => {
                if (item) {
                    data[index].academic_year = item;
                } else {
                    data[index].academic_year = {};
                }
            });

            return data;
        }catch(err){
            return {code:"Term reading err", message:"An error occurred during the read process"};
        }        
    },
    async updateTerm(id,newTermInfors){
        try{
            //Dùng hàm kiểm tra học kỳ với id học kỳ được gửi lên từ phía client 
            //có tồn tại hay không 
            //nếu tồn tại mới tiếp tục thực hiện update
            //nếu không tồn tại trả về lỗi
            const checkEx = await this.checkExistTerm(id);
            if(checkEx){
                const query = db.collection('terms').doc(id);
                //xử lý bất đồng bộ kết quả sau khi thực hiện update
                //nếu thành công trả về code 0
                const result = await query.update(newTermInfors);
                return {code:0, message:"Update successful"};
            }
            return {code:"Term updating err", message:"Term does not exist"};
        }catch(err){
            return {code:"Term updating err", message:"An error occurred during the update process"};
        }
    },
    async deleteTerm(id){
        try{
            //Dùng hàm kiểm tra học kỳ với id học kỳ được gửi lên từ phía client 
            //có tồn tại hay không 
            //nếu tồn tại mới tiếp tục thực hiện delete
            //nếu không tồn tại trả về lỗi
            const checkEx = await this.checkExistTerm(id);
            if(checkEx){
                const query = db.collection("terms").doc(id);
                //Xử lý bất đồng bộ kết quả trả về sau khi xóa 
                //Nếu xóa thành công trả về code 0
                const result = await query.delete();
                return {code:0, message:"Delete successful"};
            }
            return {code:"Term deleting err", message:"Term does not exist"};
        }catch(err){
            return {code:"Term deleting err", message:"An error occurred during the delete process"};
        }
    },
    async getTermById(id){
        try{
            const query = db.collection("terms").doc(id);
            //Xử lý bất đồng bộ kết quả trả về sau khi thực hiện tìm kiếm term bằng termID
            //Nếu kết quả trả về tồn tại term 
            //sẽ xuất thông tin term đó trả về phía client
            const result = await query.get();
            if(result.exists){
                return {id, ...result.data()};
            }
            return {code:"Term reading err", message:"Term does not exist"}; 
        }catch(e){
            return {code: "Term getting err", message: e.message};
        }
    },
    async checkExistTerm(id){                           //Hàm kiểm tra Term có tồn tại hay không bằng cách sử dụng termID
        const query = db.collection("terms").doc(id);
        const result = await query.get();
        if(result.exists){
            return true;
        }
        return false;
    }
}

module.exports = termModel;