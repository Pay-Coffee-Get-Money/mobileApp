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
            return {code: "Subject error", msg: "An error occurred during processing"};
        }
    }
}

module.exports = topicModel;