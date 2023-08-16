const {db} = require('../config');

const academicYearModel = {
    async createAcademicYear(infors){
        try{
            const result = await db.collection("academic_years").doc().set(infors);
            return {code:0,message:"Successfully create AcademicYear"};
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    async readAcademicYear(){
      try{
        const query = db.collection("academic_years");
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
    async updateAcademicYear(Id,newInfors){
        try{
            if(await this.checkExistAcademicYear(Id)){
                const query = db.collection("academic_years").doc(Id);
                const result = await query.update(newInfors);
                return {code:0,message:"Successfully update academic_year"}; 
            }
            return {code:"Academic_years updating error",message:"Academic_years does not exist"}; 
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    async deleteAcademicYear(Id){
        try{
            const query = db.collection("academic_years").doc(Id)
            const result = await query.delete();
            return {code:0,message:"Successfully delete academic_year"}; 
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    async getAcademicYearById(Id){
        try{
            const query = db.collection("academic_years").doc(Id);
            const result = await query.get();
            if(result.data() != null){
                return {id:Id,...result.data()}; 
            }
            return {code:"Academic_year reading error",message:"Academic_year does not exist"}; 
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    async checkExistAcademicYear(id){                           //Hàm kiểm tra Topic có tồn tại hay không bằng cách sử dụng topicID
        const query = db.collection("academic_years").doc(id);
        const result = await query.get();
        if(result.exists){
            return true;
        }
        return false;
    }
}

module.exports = academicYearModel;