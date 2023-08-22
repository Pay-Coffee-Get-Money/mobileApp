const {db} = require('../config.js');
const accountModel = require('./accountModel.js');

const userModel = {
    createUser(data){
        //tạo thông tin user
        db.collection('users').doc().set(data)
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
                data.push({id: item.id,...item.data()});
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
    }    
}

module.exports = userModel;