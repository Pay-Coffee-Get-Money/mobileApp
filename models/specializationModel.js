const {db} = require('../config');

const specializationModel = {
    async createSpecialization(infors){
        try{
            const result = await db.collection("specializations").doc().set(infors);
            return {code: 0, message: "Successfully create specialization"};
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async readSpecialization(){
      try{
        const query = db.collection("specializations");
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
    async updateSpecialization(Id, newInfors){
        try{
            if(await this.checkExist(Id)){
                const query = db.collection("specializations").doc(Id);
                const result = await query.update(newInfors);
                return {code: 0, message: "Successfully update specialization"}; 
            }
            return {code: "Specialization updating error", message: "Specialization does not exist"}; 
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async deleteSpecialization(Id){
        try{
            const query = db.collection("specializations").doc(Id)
            const result = await query.delete();
            return {code: 0, message: "Successfully delete specialization"}; 
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async getSpecializationById(Id){
        try{
            const query = db.collection("specializations").doc(Id);
            const result = await query.get();
            if(result.data() != null){
                return {id: Id, ...result.data()}; 
            }
            return {code: "Specialization updating error", message: "Specialization does not exist"}; 
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async checkExist(id){                           //Hàm kiểm tra class có tồn tại hay không bằng cách sử dụng specializationID
        const query = db.collection("specializations").doc(id);
        const result = await query.get();
        if(result.exists){
            return true;
        }
        return false;
    }
}

module.exports = specializationModel;