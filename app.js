const express = require('express');
const app = express();

const {authentication,
    termManagament,
    subjectManagament,
    courseManagament,
    topicManagament,
    groupManagament,
    deadlineManagament,
    specializationManagament,
    fileManagament,
    userManagament,
    academicYearManagament,
    registrationRequiredManagament,
    notificationManagament,
    chatManagament,
    processManagament
} = require('./routes/index');

const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

// Sử dụng middleware body-parser để xử lý dữ liệu URL-encoded
app.use(bodyParser.urlencoded({ extended: false }));

// Sử dụng middleware body-parser để xử lý dữ liệu JSON
app.use(bodyParser.json());

// Cấu hình middleware để phục vụ các tệp tĩnh từ thư mục 'src'
app.use(express.static(path.join(__dirname, 'src')));

app.use(express.json());
app.use(cors());
app.use('/',authentication);
app.use('/',termManagament);
app.use('/',subjectManagament);
app.use('/',courseManagament);
app.use('/',topicManagament);
app.use('/',groupManagament);
app.use('/',deadlineManagament);
app.use('/',specializationManagament);
app.use('/',fileManagament);
app.use('/',userManagament);
app.use('/',academicYearManagament);
app.use('/',registrationRequiredManagament);
app.use('/',notificationManagament);
app.use('/',chatManagament);
app.use('/',processManagament);

//send mail thông báo tới hạn deadline cho user
const sendMail = require('./src/mailer/sendMail');
const checkDeadline = async ()=>{
    // Đây là hàm bạn muốn thực thi sau mỗi 24 giờ
    const userModel = require('./models/userModel');
    try{
        await userModel.readUser()
        .then(users=>{
            const arrSubjectIdsWithEmail = [];
            users.forEach(user =>{
                if(user['subjectIds']){
                    user['subjectIds'].forEach((subject=>{
                        arrSubjectIdsWithEmail.push({
                            email: user.email,
                            subjectId : subject
                        })
                    }))
                }
            })
            return arrSubjectIdsWithEmail;
        })
        .then(async arrSubjectIdsWithEmail=>{
            const promiseArr = await Promise.all(
                arrSubjectIdsWithEmail.map(async item=>{
                    const subjectModel = require('./models/subjectModel');
                    const subject = await subjectModel.getSubjectById(item.subjectId);
                    if(subject.code == 'Subject reading err'){
                        return null;
                    }else{
                        if(subject.deadline_topic !== undefined){
                            const remainingDays = calculateDaysToNow(subject.deadline_topic.trim());
                            return { 
                                ...item, 
                                subjectName : subject.name,
                                deadline_topic : subject.deadline_topic,
                                remaining_days : Math.floor(remainingDays)
                            };
                        }else{
                            return null;
                        }
                    }
                }))
            
            // Filter out null values (items without a subject)
            const filteredArr = promiseArr.filter(item => item !== null && item.remaining_days !== 0);

            return filteredArr;
        })
        .then(arrSubjectIdWithEmail => {
            arrSubjectIdWithEmail.forEach(item => {
                sendMail(item);
            })
        })
    }catch(err){
        console.log(err);
    }
}

function calculateDaysToNow(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();

    if(date>now){
        // Calculate the difference in milliseconds
        const timeDifference = now - date;

        // Convert milliseconds to days
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

        return Math.abs(daysDifference); // Ensure the result is positive
    }else{
        return null
    }   
}

// Thực hiện hàm checkDeadline lần đầu tiên ngay khi chạy
checkDeadline();

// Thực hiện hàm checkDeadline sau mỗi 24 giờ
setInterval(checkDeadline, 24 * 60 * 60 * 1000);


const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`listening on port: http://localhost:${PORT}`);
})