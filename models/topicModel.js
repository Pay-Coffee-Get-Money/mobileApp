const {db} = require('../config');

const topicModel = {
    async createTopic(topicInfors){
        try{
            const result = await db.collection("topics").doc().set(topicInfors)
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
        result.forEach((item) => {
            data.push({id: item.id,...item.data()});
        })
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
        
            //Lấy số lượng sinh viên đăng ký thành công của từng đề tài sau đó thêm vào từng item đề tài
            topicsData = await Promise.all(topicsData.map(async (topic, index) => {
                const studentJoinThisTopic = await this.getStudentsInTopic(topic.id);
                return {...topic, number_of_student_registrations: studentJoinThisTopic.length};
            }))

            //Truyền dữ liệu tạo chart
            const labels = [];
            const dataNumbers = []; 
            topicsData.forEach((topic, index) => {
                labels.push(topic.name);
                dataNumbers.push(topic.number_of_student_registrations);
            })
            //lấy số sinh viên trong môn học
            const subjectModel = require('./subjectModel');
            const stdInSubject = await subjectModel.getStudentsInSubject(subjectId);
            const number_of_student_in_subject = stdInSubject.length;
        
            const chartHandler = require('../src/chart/chartHandler');
            const pathChart = await chartHandler.createChart(labels,dataNumbers,number_of_student_in_subject);
            return pathChart;
        }catch(err){
            return {code: "Topics error", msg: "An error occurred during processing"};
        }
    }
}

module.exports = topicModel;