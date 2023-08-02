const {firebase,auth} = require('../config.js');

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
    },
    resetPassword(email){
        return firebase.auth().sendPasswordResetEmail(email)
    }
}

module.exports = accountModel;
