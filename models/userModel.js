const {db} = require('../config.js');

const userModel = {
    createUser(data){
        //tạo thông tin user
        db.collection('users').doc().set({
            email : data.email,
            username : data.username,
            role : data.role,
            active : data.active
        })
        .then((user)=>{
            //có thể bỏ
            console.log(user);
        })
        .catch((error) => {
            res.json({code:err.code,msg:err.message});
        });
    },
    getUserInforByEmail(email){ //Tìm UserInf bằng email sau đó trả về 1 promise
        const query = db.collection('users').where('email', '==', email);
        return query.get();
    }
}

module.exports = userModel;