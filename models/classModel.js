const {db} = require('../config');

const classModel = {
    async createGroup(classInfors){
        try{
            const result = await db.collection("classes").doc().set(classInfors)
            return {code: 0, message: "Successfully create class"};
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async readClass(){
      try{
        const query = db.collection("classes");
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
    async updateClass(classId, newClassInfors){
        try{
            if(await this.checkExistClass(classId)){
                const query = db.collection("classes").doc(classId);
                const result = await query.update(newClassInfors);
                return {code: 0, message: "Successfully update class"}; 
            }
            return {code: "Class updating error", message: "Class does not exist"}; 
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async deleteClass(classId){
        try{
            const query = db.collection("classes").doc(classId)
            const result = await query.delete();
            return {code: 0, message: "Successfully delete class"}; 
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async getClassById(classId){
        try{
            const query = db.collection("classes").doc(classId);
            const result = await query.get();
            return {id: classId, ...result.data()}; 
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async checkExistClass(id){                           //Hàm kiểm tra class có tồn tại hay không bằng cách sử dụng classID
        const query = db.collection("classes").doc(id);
        const result = await query.get();
        if(result.exists){
            return true;
        }
        return false;
    }
}

module.exports = classModel;