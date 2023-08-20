const { invalid } = require('moment/moment');
const {db} = require('../config');

const registrationRequiredModel = {
    async createRequired(type, userId, id){
        try{
            const resultClassify = this.classify(type, userId, id);
            //Trả lỗi định dạng sai url
            if(resultClassify.code == 1){
                return resultClassify;
            }
            // Kiểm tra deadline trước khi tạo yêu cầu
            const isTimeOut = await this.checkTimeOut(type,id);
            console.log(isTimeOut);
            if(isTimeOut){         //nếu đã qua deadline thì sẽ trả về lỗi không được đăng ký rồi thông báo
                return {code: 3, message: "Can't register because the time has passed"};
            }
            //tạo doc mới cho collection registration_requires 
            const query = db.collection('registration_requires').doc();
            const result = await query.set(resultClassify);
            return {code: 0, msg : "Sucessing create request"};
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async checkTimeOut(type,id){
        try{
            let subjectId = '';
            if(type == "group"){
                const group = await db.collection('groups').doc(id).get();
                subjectId = group.data().subjectId;
            }else if(type == "subject"){
                subjectId = id;
            }else if(type == 'topic'){
                const topic = await db.collection('topics').doc(id).get();
                subjectId = topic.data().subjectId;
            }else{
                return {code: 1, msg: "Invalid type"};
            }

            const deadlineDoc = await db.collection('deadlines')
            .where("subjectId",'==',subjectId)
            .where("type",'==',type)
            .get();
            let deadline = "";
            deadlineDoc.forEach(item=>{
                if(item.data()){
                    deadline = item.data().deadline;
                }
            })

            const moment = require('moment');
            const deadlineMoment = moment(deadline, "MMMM DD, YYYY HH:mm:ss UTCZ");

            let deadlineTimestamp;
            if (deadlineMoment.isValid()) {
                deadlineTimestamp = deadlineMoment.valueOf(); // Chuyển đổi sang timestamp (miliseconds)
            }
            // Lấy thời gian hiện tại và chuyển đổi sang timestamp
            const currentTimestamp = moment().valueOf();
            //So sánh thời gian đăng ký với dealine
            if(deadlineTimestamp < currentTimestamp || deadlineTimestamp){
                return false;
            }else{
                return true;
            }
        }catch (err){
            return {code: 'err', message: err};
        }
    },
    async readRequired(){
        try{
            const query = db.collection('registration_requires');
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
    async deleteRequired(id){
        try{
            const query = db.collection("registration_requires").doc(id);
            const result = await query.delete();
            return {code: 0, message: "Successfully delete requirement"}; 
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async getRequiredById(id){
        try{
            const query = db.collection("registration_requires").doc(id);
            //Xử lý bất đồng bộ kết quả trả về sau khi thực hiện tìm kiếm registration_require bằng registration_require_id
            //Nếu kết quả trả về tồn tại registration_require 
            //sẽ xuất thông tin term đó trả về phía client
            const result = await query.get();
            if(result.exists){
                return {id, ...result.data()};
            }
            return {code:"Registration_require reading err", message:"Registration required does not exist"}; 
        }catch(e){
            return {code: "Registration_require getting err", message: e.message};
        }
    },
    classify(type, userId, id){
        switch(type){
            case "group":
                const groupModel = require('./groupModel');
                groupModel.updateGroup(id,{required_status : false}); //Khi người dùng đăng ký group thì trường required_status = false, chờ duyệt nhóm
                return {
                    type,
                    groupId : id,
                    userId
                }
            case "subject":
                return {
                    type,
                    subjectId : id,
                    userId
                }
            case "topic":
                return {
                    type,
                    topicId : id,
                    userId
                }
            default:    
                return {code: 1, msg: "Invalid type"};
        }
    },
    async requireHandle(id,isApproved){
        try{
            if(isApproved == false){                                        //Nếu yêu cầu bị từ chối sẽ xóa yêu cầu đó đi sau đó gửi thông báo
                const rsDelete = await this.deleteRequired(id);
                return rsDelete;
            }

            const request = await this.getRequiredById(id);
            if(request.type == 'group'){                                    //Nếu type của yêu cầu là group thì update trường required_status == true
                const groupModel = require('./groupModel');
                const result = await groupModel.updateGroup(id,{required_status : true});
                return result;
            }else if(request.type == 'subject' || request.type == 'topic'){     //Nếu type == subject/topic thì thêm sinh viên đã gửi yêu cầu vào subject/topic
                const enrollStudent = require('./enrollStudent ');
                const result = await enrollStudent.group_subject_topic_adding(["",request.type,request.userId,request.subjectId ? request.subjectId : request.topicId]);//Mảng được đưa vào với định dạng ["",type,userId]
                //Sau khi comfirm yêu cầu thêm sv vào subject/topic
                //Sẽ xóa yêu cầu đó đi sau khi thêm thành công
                if(result.code == 0){
                    await this.deleteRequired(id);
                }
                return result;
            }else{
                return {code: 1, msg: "Invalid type"};
            }
        }catch(err){
            return {code: err.code, message: err.details};
        }
    }
}

module.exports = registrationRequiredModel;