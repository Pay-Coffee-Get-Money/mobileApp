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
            return {id:topicId,...result.data()}; 
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    async checkExistTopic(id){                           //Hàm kiểm tra Topic có tồn tại hay không bằng cách sử dụng courseID
        const query = db.collection("topics").doc(id);
        const result = await query.get();
        if(result.exists){
            return true;
        }
        return false;
    }
}

module.exports = topicModel;