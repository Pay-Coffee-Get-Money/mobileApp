const enrollStudent = {
    async group_subject_topic_adding(pathParts){
        try{     
            const groupModel = require('./groupModel');
            const subjectModel = require('./subjectModel');
            const userModel = require('./userModel');

            const resultClassify = this.classify(pathParts);
            if(resultClassify.code == 4){           //Trả về lỗi nếu sai cú pháp url
                return resultClassify;
            }

            const user = await userModel.getUserById(resultClassify.userId); // Lấy thông tin user bằng id được gửi lên từ phía client
            if(user.code){  //kiểm tra user có tồn tại hay không
                return {code : 5, msg: "This userId is invalid"};
            }
            // Lấy danh sách id của các subject/group/topic user đã tham gia
            const Ids = user[resultClassify.takeFieldFromUser];    

            const {subjectId} = await groupModel.getGroupById(resultClassify.objectId); // Lấy mã môn học của nhóm học sinh viên muốn tham gia
            if(resultClassify.type == 'group'){
                const {members_per_group} = await subjectModel.getSubjectById(subjectId);   //Lấy thông tin về số lượng sinh viên cho phép cho mối nhóm của môn học đó
                //Lấy số lượng sinh viên đã tham gia nhóm đó
                const stdsInGroup = await groupModel.getStudentsInGroup(resultClassify.objectId); 
                const numberOfStdInGroup = stdsInGroup.length;
                //Xử lý trường hợp số lượng sinh viên trong nhóm đã đủ thành viên theo yêu cầu của môn học
                if(numberOfStdInGroup == members_per_group){
                    return {code : 3, msg: "This group has enough members"};
                }
            }
            
            // Xử lý trường hợp user chưa tham gia môn học / group hay tạo group / topic nào
            if(!Ids || Ids.length === 0){  
                await userModel.updateUser(user.id, { [resultClassify.takeFieldFromUser]:[resultClassify.objectId] });
                return {code : 0, msg: "success adding"};
            }
            // Xử lý trường hợp user request tham gia/đăng ký subject/group/topic đó lần 2 (Tránh bị trùng)
            let foundDuplicate = false;
            Ids.forEach((item) => {
                if(item === resultClassify.objectId) {
                    foundDuplicate = true;
                }
            })
            
            let foundDuplicateSubject = false;
            if(resultClassify.type == 'group'){
                // Xử lý trường hợp user tham gia 2 group của cùng 1 môn học
                for(const item of Ids){                                
                    const {subjectId : subjectId_of_group_user_has_joined} = await groupModel.getGroupById(item);
                    if(subjectId_of_group_user_has_joined === subjectId) {  //so sánh mã môn học của những nhóm user đã tham gia với mã môn học của nhóm user muốn tham gia
                        foundDuplicateSubject = true;
                        break;
                    }
                }
            }
            
            //Xử lý các trường hợp trùng lặp
            if(foundDuplicate){
                return {code : 1, msg: `This student is already a member of this ${resultClassify.type}`};
            }else if(foundDuplicateSubject){
                if(resultClassify.type == 'group'){
                    return {code : 2, msg: "You cannot join 2 groups in the same subject"};
                }else if(resultClassify.type == 'subject'){
                    return {code : 2, msg: "This user has joined this subject"};
                }else if(resultClassify.type == 'topic'){
                    return {code : 2, msg: "This user has accept to sign this topic before"};
                }
            }else{
                // Thêm groupId/subjectId mới vào mảng groupIds/subjectIds của user
                Ids.push(resultClassify.objectId);
                await userModel.updateUser(user.id, { [resultClassify.takeFieldFromUser] : Ids });
                return {code : 0, msg: "success adding"};
            }
        }catch(err){
            return {code: err.code, message: err.details};
        }
    },
    async group_subject_topic_deleting(pathParts){
        try{
            const userModel = require('./userModel');

            const resultClassify = this.classify(pathParts);    //Phân loại subject/group/topic

            //Lấy user cần xóa khỏi group/subject/topic
            const user = await userModel.getUserById(resultClassify.userId);
            //Thay đổi trường groupIds/groupIds/topicIds của user thành mảng mới đã loại groupId/subjectId/topicId
            const ids = user[resultClassify.takeFieldFromUser].filter((item) => {
                return item !== resultClassify.objectId;
            })
            //Update laị trường groupIds/subjectIds/topicIds của user
            const result = await userModel.updateUser(resultClassify.userId, {[resultClassify.takeFieldFromUser] : ids});
            return result;
        }catch (err){
            return {code: err.code, message: err.details};
        }
    },
    classify(pathParts){
        const type = pathParts[1];
        const userId = pathParts[2];

        switch(type){
            case "group":
                return {
                    type: "group",
                    userId: userId,
                    objectId: pathParts[3],                 //cụ thể là groupId
                    takeFieldFromUser: "groupIds"
                }
            case "subject":
                return {
                    type: "subject",
                    userId: userId,
                    objectId: pathParts[3],                 //cụ thể là subjectId
                    takeFieldFromUser: "subjectIds"
                }
            case "topic":
                return {
                    type: "topic",
                    userId: userId,
                    objectId: pathParts[3],                 //cụ thể là topicId
                    takeFieldFromUser: "topicIds"
                }
            default:
                return {code : 4, msg: "Format url is invalid, please try again"};
        }
    },
    async deleteRequest(){

    }
}

module.exports = enrollStudent;