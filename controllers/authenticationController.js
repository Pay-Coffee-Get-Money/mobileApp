const {firebase,auth,admin, jwtSecrectKey} = require('../config.js');
const jwt = require('jsonwebtoken');
const accountModel = require('../models/accountModel.js');
const userModel = require('../models/userModel.js');

const authentication = {
    signUp: function (req, res){
        const data = req.body;
        accountModel.signUp(data)
        .then((userCredential) => {
            const user = userCredential.user;
            //Gửi mail xác thực 
            accountModel.verifyEmail(user)            
            .then(() => {
                 //Sau khi đăng ký thành công  lúc này 
                // tạo song song với account collect của fireBaseAuth 
                // một user collection để lưu các thuộc tính thông tin cần thiết
                // mà fireBaseAth không cấp
                userModel.createUser(data);
                //Ta trả về thông báo kiểm tra email
                res.json({code: "Verification email", msg: "Please check your email to complete the account creation verification process"});
            })
            .catch(err => res.json({code: err.code, msg: err.message}))
        })
        .catch((err) => {
            res.json({code:err.code,msg:err.message});
        })
    },
    signIn(req,res){
        const data = req.body;
        //Xử lý đăng nhập qua accountModel
        accountModel.signIn(data)
        .then((user) => {
            //Kiểm tra tài khoản đã xác thực hay chưa
            //Nếu đã xác thực sẽ trả về thông tin user
            if (!user.user.emailVerified) {
                return 1;
            } else{
                return user;
            }
        })
        .then((rs) => {
            if(rs == 1){
                //Trả về thông báo email chưa xác thực 
                res.json({code: "Login error", msg: "User's email has not been verified yet, please check your email to countinue login"});
            }else{
                //lấy thông tin user bằng email sau khi đăng nhập thành công
                //hàm này trả về 1 promise
                userModel.getUserInforByEmail(rs.user.email)
                .then((snapshot) => {
                    if (snapshot.empty || snapshot.length === 0 || snapshot === null) {
                        res.json({code:2,msg:"User not found"});
                    } 
                    else {
                        let userInf;
                        let userId;
                        snapshot.forEach((doc) => {
                            userInf = doc.data();
                            userId = doc.id;
                        });
                        //Đăng nhập thành công trả về thông tin Account join với User
                        let userData = {
                            "userId": userId,
                            "role": userInf.role
                        }
                        let token = jwt.sign(userData, jwtSecrectKey, { expiresIn: '1h' });
                        res.json({code:0,accountUser:{accountInf: rs , userInf:{ userId : userId, ...userInf }, token: token }});
                    }
                })
                .catch((err)=>{
                    res.json({code:3,msg:"Error getting user"});
                })
            }
        })
        .catch((err) => {
            res.json({code:err.code,msg:err.message});
        })
    },
    signOut(req,res){
        accountModel.signOut()
        .then(() => {
            res.json({code: 0, msg: "User logged out successfully"})
          })
          .catch((error) => {           
            res.json({code: 1, msg: "Logged out error"})
          });
    },
    forgotPassword(req,res){
        const userEmail = req.params.email;

        accountModel.resetPassword(userEmail)
        .then(() => {
            res.json({code:0,msg:"Verification code sent successfully, please check your email!"});
        })
        .catch((error) => {
            res.json({code: "err",msg:err});
        });
    }
}

module.exports = authentication;