const groupModel = require('../models/groupModel');
const subjectModel = require('../models/subjectModel');
const userModel = require('../models/userModel');

const enrollStudent = {
    async add_To_GroupOrSubject(pathParts){
        try{         
            const resultClassify = this.classify(pathParts);
            if(resultClassify.code == 4){           //Trả về lỗi nếu sai cú pháp url
                return resultClassify;
            }

            const user = await userModel.getUserById(resultClassify.userId); // Lấy thông tin user bằng id được gửi lên từ phía client
            if(user.code){  //kiểm tra user có tồn tại hay không
                return {code : 5, msg: "This userId is invalid"};
            }
            // Lấy danh sách id của các subject/group user đã tham gia
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
            
            // Xử lý trường hợp user chưa tham gia môn học hoặc group hay tạo group nào
            if(!Ids || Ids.length === 0){  
                await userModel.updateUser(user.id, { [resultClassify.takeFieldFromUser]:[resultClassify.objectId] });
                return {code : 0, msg: "success adding"};
            }
            // Xử lý trường hợp user request tham gia subject/group đó lần 2 (Tránh bị trùng)
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
                return {code : 2, msg: "You cannot join 2 groups in the same subject"};
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
            default:
                return {code : 4, msg: "Format url is invalid, please try again"};
        }
    }
}

module.exports = enrollStudent;