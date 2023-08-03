const {db} = require('../config');

const courseModel = {
    async createCourse(courseInfors){
        try{
            const result = await db.collection("courses").doc().set(courseInfors)
            return {code:0,message:"Successfully create course"};
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    async readCourse(){
      try{
        const query = db.collection("courses");
        const result = await query.get();
        const data = [];
        result.forEach((item) => {
            data.push({id:item.id,...item.data()});
        })
        return data;
      }catch(err){
        return {code:err.code,message:err.details}
      }
    },
    async updateCourse(courseId,newCourseInfors){
        try{
            if(await this.checkExistCourse(courseId)){
                const query = db.collection("courses").doc(courseId);
                const result = await query.update(newCourseInfors);
                return {code:0,message:"Successfully update course"}; 
            }
            return {code:"Course updating error",message:"Course does not exist"}; 
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    async deleteCourse(courseId){
        try{
            const query = db.collection("courses").doc(courseId)
            const result = await query.delete();
            return {code:0,message:"Successfully delete course"}; 
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    async getCourseById(courseId){
        try{
            if(await this.checkExistCourse(courseId)){
                const query = db.collection("courses").doc(courseId)
                const result = await query.get();
                return {id:courseId,...result.data()}; 
            }
            return {code:"Course getting error",message:"Course does not exist"}; 
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    async checkExistCourse(id){                           //Hàm kiểm tra Course có tồm tại hay không bằng cách sử dụng courseID
        const query = db.collection("courses").doc(id);
        const result = await query.get();
        if(result.exists){
            return true;
        }
        return false;
    }
}

module.exports = courseModel;