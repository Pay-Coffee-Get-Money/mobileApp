const {db} = require('../config');

const deadlineModel = {
    async createDeadline(infors){
        try{
            const result = await db.collection("deadlines").doc().set(infors)
            return {code: 0, message: "Successfully create dealine"};
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async readDeadline(subjectId){
      try{
        const query = db.collection("deadlines").where("subjectId", "==", subjectId);
        const querySnapshot = await query.get();
        const listDeadline = [];
        querySnapshot.forEach((doc) => {
            listDeadline.push({id: doc.id, ...doc.data()});
        });

        return listDeadline;
      }catch(err){
        return {code: err.code, message: err.details};
      }
    },
    async updateDeadline(deadlineId, newInfors){
        try{
            if(await this.checkExistDeadline(deadlineId)){
                const query = db.collection("deadlines").doc(deadlineId);
                const result = await query.update(newInfors);
                return {code: 0, message: "Successfully update dealine"}; 
            }
            return {code: "Dealine updating error", message: "Dealine does not exist"}; 
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async deleteDeadline(id){
        try{
            const query = db.collection("deadlines").doc(id);
            const result = await query.delete();
            return {code: 0, message: "Successfully delete deadline"}; 
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async checkExistDeadline(id){                           //Hàm kiểm tra deadline có tồn tại hay không bằng cách sử dụng deadlineId
        const query = db.collection("deadlines").doc(id);
        const result = await query.get();
        if(result.exists){
            return true;
        }
        return false;
    }
}

module.exports = deadlineModel;