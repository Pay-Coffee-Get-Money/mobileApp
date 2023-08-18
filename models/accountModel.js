const {firebase,auth,admin} = require('../config.js');

const accountModel = {
    signUp(data){
        // Đăng ký người dùng mới bằng email/password
        const email = data.email;
        const password = data.password;
        return auth.createUserWithEmailAndPassword(email,password);
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
    },
    verifyEmail(currentUser){
        return currentUser.sendEmailVerification();
    },
    async deleteAccount(email){
        try{
            const {uid} = await admin.auth().getUserByEmail(email);
            const result = await admin.auth().deleteUser(uid);
            return result;
        }catch(err){
            return err;
        }
    }
}

module.exports = accountModel;
