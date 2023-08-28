const {db} = require('../config');

const topicModel = {
    async createTopic(topicInfors){
        try{
            const ref = await db.collection("topics").doc();
            const result = await ref.set(topicInfors);

            //Đồng thời tạo tiến trình dự án của đề tài đã đăng ký
            const processModel = require('./processModel');
            const process = await processModel.createProcess(ref.id,topicInfors);
            console.log(process)
            return {code:0,message:"Successfully create topic"};
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    async readTopic(){
      try{
        const query = db.collection("topics");
        const result = await query.get();
        const data = [];

        for (const item of result.docs) {
            //Trả thêm thông tin muôn học của topic đó
            const subjectId = item.data().subjectId;
            const subjectModel = require('./subjectModel');
            const subjectInfors = await subjectModel.getSubjectById(subjectId);
            data.push({id: item.id, ...item.data(), subjectInfors});
        }

        return data;
      }catch(err){
        return {code:err.code,message:err.details}
      }
    },
    async updateTopic(topicId,newTopicInfors){
        try{
            if(await this.checkExistTopic(topicId)){
                const query = db.collection("topics").doc(topicId);
                const result = await query.update(newTopicInfors);
                return {code:0,message:"Successfully update topic"}; 
            }
            return {code:"Topic updating error",message:"Topic does not exist"}; 
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    async deleteTopic(topicId){
        try{
            const query = db.collection("topics").doc(topicId)
            const result = await query.delete();
            return {code:0,message:"Successfully delete topic"}; 
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    async getTopicById(topicId){
        try{
            const query = db.collection("topics").doc(topicId)
            const result = await query.get();
            if(result.data() != null){
                return {id:topicId,...result.data()}; 
            }
            return {code:"Topic reading error",message:"Topic does not exist"}; 
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    async checkExistTopic(id){                           //Hàm kiểm tra Topic có tồn tại hay không bằng cách sử dụng topicID
        const query = db.collection("topics").doc(id);
        const result = await query.get();
        if(result.exists){
            return true;
        }
        return false;
    },
    async getStudentsInTopic(topicId){
        try{
            const userModel = require('./userModel');
            const listUser = await userModel.readUser(); //Lấy danh sách tất cả các user
            const listUser_In_Topic = listUser.filter((user) => {    //Trả về mảng chứa danh sách sinh viên có tham gia topic này
                if(user.topicIds && user.topicIds.length > 0 && user.topicIds.includes(topicId)){    //Kiểm tra trong mảng id các topics user đang tham gia có id topic đang cần lấy danh sách sv hay không
                    return user;
                }
            })
            return listUser_In_Topic;
        }catch(err){
            return {code: "Topics error", msg: "An error occurred during processing"};
        }
    },
    async getStatistics(subjectId){
        try{
            //Lấy các đề tài trong môn học
            const topicsRef = db.collection("topics");
            const topicsQuery = topicsRef.where("subjectId", "==", subjectId);
            const topicsSnapshot = await topicsQuery.get();
        
            let topicsData = [];
            topicsSnapshot.forEach(topicDoc => {
                const topic = {id: topicDoc.id, ...topicDoc.data()};
                topicsData.push(topic);
            });

            //Lấy số lượng sinh viên đã đăng ký đề tài thành công
            let number_of_students_successfully_registered = 0;
            topicsData.forEach(item=>{
                if(item.status === true){
                    number_of_students_successfully_registered++;
                }
            })
            //Lấy số lượng sinh viên đang chờ duyệt đăng ký đề tài
            let number_of_students_waiting_for_approval = 0;
            topicsData.forEach(item=>{
                if(item.status === 'approved'){
                    number_of_students_waiting_for_approval++;
                }
            })
            //lấy số sinh viên trong môn học
            const subjectModel = require('./subjectModel');
            const stdInSubject = await subjectModel.getStudentsInSubject(subjectId);
            const number_of_student_in_subject = stdInSubject.length;
            //Lấy số lượng sinh viên chưa đăng ký
            let number_of_students_unregistered = number_of_student_in_subject - number_of_students_successfully_registered - number_of_students_waiting_for_approval;

            //Truyền dữ liệu tạo chart
            const dataNumbers = [number_of_students_successfully_registered , number_of_students_unregistered , number_of_students_waiting_for_approval];
            const chartHandler = require('../src/chart/chartHandler');
            const pathChart = await chartHandler.createChart(dataNumbers);
            return pathChart;
        }catch(err){
            return {code: "Topics error", msg: "An error occurred during processing"};
        }
    },
    async submitTopicFile(userId,topicId,subjectId,fileName){
        try{
            const result = await db.collection("submit_files").doc().set({
                userId,
                topicId,
                subjectId,
                file: fileName
            })
            return {code:0,message:"Successfully submit file"};
        }catch(err){
            return {code: "Topics error", msg: "An error occurred during processing "+err};
        }
    },
    async readTopicFilesSubmit(subjectId) {
        try {
            const query = db.collection("submit_files");
            const result = await query.get();
            const data = [];
            const arrPromise = [];
            
            result.forEach(async (item) => {
                if (item.data().subjectId == subjectId) {
                    data.push({ id: item.id, ...item.data() });

                    const topicPromise = topicModel.getTopicById(item.data().topicId);
                    arrPromise.push(topicPromise);
                }
            });
    
            const topicResults = await Promise.all(arrPromise); // Lưu kết quả của Promise.all
            data.forEach((item, index) => {
                if (topicResults[index]) {
                    const topicData = topicResults[index];
                    item.topic = topicData;
                }
            });
    
            return data;
        } catch (err) {
            return { code: err.code, message: err.details };
        }
    },
    async downloadFilesSubmit(idFileSubmit) {
        try {
            const query = db.collection("submit_files").doc(idFileSubmit);
            const result = await query.get();
            
            if (result.data() != null) {
                // Lấy path đến file đó
                const path = require('path');
                const filePath = path.join(__dirname, `../src/fileUploads/${result.data().file}`);
                return filePath;
            } else {
                return { code: 1, message: 'File not found' };
            }
        } catch (err) {
            return { code: err.code, message: err.details };
        }
    },
    async markFilesSubmit(idFileSubmit,mark){
        try{
            const query = db.collection("submit_files").doc(idFileSubmit);
            const result = await query.update({mark});
            return {code:0,message:"Successfully mark for this"}; 
        }catch(err){
            return {code:err.code,message:err.details};
        }
    }
}

module.exports = topicModel;