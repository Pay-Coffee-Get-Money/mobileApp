const firebase = require('firebase/compat/app');
require('firebase/compat/auth');
require('firebase/compat/firestore');

// Khởi tạo ứng dụng Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBADjrUrVAa85U82xqdqOzB0R4k8cJrl6g",
  authDomain: "mobileapp-a2ed4.firebaseapp.com",
  projectId: "mobileapp-a2ed4",
  storageBucket: "mobileapp-a2ed4.appspot.com",
  messagingSenderId: "280074442270",
  appId: "1:280074442270:web:4e14e655ea1fe79a83800f",
  measurementId: "G-WCDL4FHZ7E"
};
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
module.exports = {firebase,auth};