const userModel = require('../models/userModel.js')

const UserControllers = {
    signUp: function (req, res){
        const data = req.body;
        userModel.signUp(data)
        .then((userCredential) => {
            console.log(userCredential);
            res.send({code:0,msg:"User added"});
        })
        .catch((err) => {
            res.send({code:err.code,msg:err.message});
        })
    },
    signIn(req,res){
        const data = req.body;
        userModel.signIn(data)
        .then((result) => {
            res.send({code:0,user:result});
        })
        .catch((err) => {
            res.send({code:err.code,msg:err.message});
        })
    },
    signInWithGoogle(req,res){
        // userModel.signInWithGoogle()
        // .then((result) => {
        //     res.send({code:0,user:result});
        // })
        // .catch((err) => {
        //     res.send({code:err.code,msg:err.message});
        // })
    }
}

module.exports = UserControllers;