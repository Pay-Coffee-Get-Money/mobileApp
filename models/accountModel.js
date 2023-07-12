const {firebase,auth,admin} = require('../config.js');
const bcrypt = require('bcrypt');


const accountModel = {
    signUp(data){
        // Đăng ký người dùng mới bằng email/password
        return auth.createUserWithEmailAndPassword(data.email,data.password);
    },
    signIn(data){
        // Đăng nhập người dùng mới bằng email/password
        return auth.signInWithEmailAndPassword(data.email,data.password);
    },
    signInWithGoogle(){
        // const provider = new firebase.auth.GoogleAuthProvider();
        // return firebase.auth().signInWithPopup(provider);
    }
}

module.exports = accountModel;
