const {firebase,auth,admin,db} = require('../config.js');
const bcrypt = require('bcrypt');

const userModel = {
    createUser(data){
        //Dùng bcrypt để hash password kết quả trả về sẽ đưa vào thông tin user
        //Lưu ý fireBase cũng đã tự hashing password bằng fireBaseAuth 
        //=> tại Account cũng có password nhưng firebase 
        //không cho phép gọi và sử dụng thuộc tính passwordHash
        bcrypt.hash(data.password, 10)
        .then((bcryptPass)=>{
            //tạo thông tin user
            db.collection('users').doc().set({
                email : data.email,
                username : data.username,
                password : bcryptPass,
                role : data.role,
                active : data.active
            })
            .then((user)=>{
                console.log(user);
            })
            .catch((error) => {
                res.send({code:err.code,msg:err.message});
            });
        })
        .catch((error) => {
            res.send({code:err.code,msg:err.message});
        })
    },
    getUserInforByEmail(email){ //Tìm UserInf bằng email sau đó trả về 1 promise
        const query = db.collection('users').where('email', '==', email);
        return query.get();
    }
}

module.exports = userModel;