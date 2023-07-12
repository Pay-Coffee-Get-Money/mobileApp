const accountModel = require('../models/accountModel.js');
const userModel = require('../models/userModel.js');

const UserControllers = {
    signUp: function (req, res){
        const data = req.body;
        accountModel.signUp(data)
        .then((userCredential) => {
            console.log(userCredential);
            //Sau khi đăng ký thành công  lúc này 
            // tạo song song với account collect của fireBaseAuth 
            // một user collection để lưu các thuộc tính thông tin cần thiết
            // mà fireBaseAth không cấp
            userModel.createUser(data);
            res.send({code:0,msg:"User added"});
        })
        .catch((err) => {
            res.send({code:err.code,msg:err.message});
        })
    },
    signIn(req,res){
        const data = req.body;
        //Sử lý đăng nhập qua accountModel
        accountModel.signIn(data)
        .then((result) => {
            //lấy thông tin user bằng email sau khi đăng nhập thành công
            //hàm này trả về 1 promise
            userModel.getUserInforByEmail(data.email)
            .then((snapshot) => {
                if (snapshot.empty) {
                    res.send({code:2,msg:"User not found"});
                } 
                else {
                    snapshot.forEach((doc) => {
                        const userInf = doc.data();
                        console.log(userInf);
                        //Đăng nhập thành công trả về thông tin Account join với User
                        res.send({code:0,accountUser:{...result,...userInf}});
                    });
                }
            })
            .catch((err)=>{
                console.log(err);
                res.send({code:3,msg:"Error getting user"});
            })
        })
        .catch((err) => {
            res.send({code:err.code,msg:err.message});
        })
    },
    async signInWithGoogle(req,res){
        // await accountModel.signInWithGoogle();
    }
}

module.exports = UserControllers;