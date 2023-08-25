const {db} = require('../config.js');
const accountModel = require('./accountModel.js');

const userModel = {
    createUser(data){
        //tạo thông tin user
        const { password , ...dataHandled} = data;
        db.collection('users').doc().set(dataHandled)
        .then((user)=>{})
        .catch((error) => {
            res.json({code:err.code,msg:err.message});
        });
    },
    async readUser(){
        try{
            const query = db.collection("users");
            const result = await query.get();
            const data = [];
            result.forEach((item) => {
                const { password , ...dataHandled} = item.data();
                data.push({id: item.id,...dataHandled});
            })
            return data;
        }catch(err){
            return {code:err.code,message:err.details}
        }
    },
    async getUserById(userId){
        try{
            const query = db.collection("users").doc(userId)
            const result = await query.get();
            if(result.data() != null){
                return {id:userId,...result.data()}; 
            }
            return {code:"User reading error",message:"User does not exist"}; 
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    async updateUser(userId,newUserInfors){
        try{
            if(await this.checkExistUser(userId)){
                const query = db.collection("users").doc(userId);
                const result = await query.update(newUserInfors);
                return {code:0,message:"Successfully update User"}; 
            }
            return {code:"User updating error",message:"User does not exist"}; 
        }catch(err){
            return {code:err.code,message:err};
        }
    },
    async checkExistUser(id){                           //Hàm kiểm tra Topic có tồn tại hay không bằng cách sử dụng topicID
        const query = db.collection("users").doc(id);
        const result = await query.get();
        if(result.exists){
            return true;
        }
        return false;
    },
    async deleteUser(Id){
        try{
            //Lấy email người dùng 
            const {email} = await this.getUserById(Id);
            //Để xóa 1 user trước tiên xóa account của user đó trước
            const rs = await accountModel.deleteAccount(email);
            //Sau đó xóa thông tin user
            const query = db.collection("users").doc(Id)
            const result = await query.delete();
            return {code:0,message:"Successfully delete user"}; 
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    getUserInforByEmail(email){                         //Tìm UserInf bằng email sau đó trả về 1 promise
        const query = db.collection('users').where('email', '==', email);
        return query.get();
    },
    async addListUserToSubject(data) {
        try {
            const subjectId = data.subjectId;
            const list_userId = data.list_userId;
    
            await Promise.all(list_userId.map(async (userId) => {
                const user = await userModel.getUserById(userId);
    
                let newSubjectIds = user.subjectIds ? [...user.subjectIds, subjectId] : [subjectId];
    
                await userModel.updateUser(userId, { subjectIds: newSubjectIds });
            }));
    
            return { code: 0, message: "Successfully adding Users" };
        } catch (err) {
            return { code: err.code, message: err.details };
        }
    },
    async addListUserToGroup(data) {
        try {
            const groupId = data.groupId;
            const list_userId = data.list_userId;
    
            await Promise.all(list_userId.map(async (userId) => {
                const user = await userModel.getUserById(userId);
    
                let newGroupIds = user.groupIds ? [...user.groupIds, groupId] : [groupId];
    
                await userModel.updateUser(userId, { groupIds: newGroupIds });
            }));
    
            return { code: 0, message: "Successfully adding Users" };
        } catch (err) {
            return { code: err.code, message: err.details };
        }
    },
    async getSubjects(userId){
        try{
            const query = db.collection("users").doc(userId)
            const result = await query.get();
            const subjectIds = result.data().subjectIds;
            const arrPromise = [];
            subjectIds.forEach((subjectId)=>{
                const subjectModel = require('./subjectModel.js');
                const subject = subjectModel.getSubjectById(subjectId);
                arrPromise.push(subject);
            })

            const subjectArr = await Promise.all(arrPromise);

            return subjectArr; 
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    async getTopics(userId){
        try{
            const query = db.collection("users").doc(userId)
            const result = await query.get();
            const topicIds = result.data().topicIds;
            const arrPromise = [];
            topicIds.forEach((topicId)=>{
                const topicModel = require('./topicModel.js');
                const topic = topicModel.getTopicById(topicId);
                arrPromise.push(topic);
            })

            const topicArr = await Promise.all(arrPromise);

            return topicArr; 
        }catch(err){
            return {code:err.code,message:err.details};
        }
    },
    async getGroups(userId){
        try{
            const query = db.collection("users").doc(userId)
            const result = await query.get();
            const groupIds = result.data().groupIds;
            const arrPromise = [];
            groupIds.forEach((groupId)=>{
                const groupModel = require('./groupModel.js');
                const group = groupModel.getGroupById(groupId);
                arrPromise.push(group);
            })

            const groupArr = await Promise.all(arrPromise);

            return groupArr; 
        }catch(err){
            return {code:err.code,message:err.details};
        }
    }
}

module.exports = userModel;