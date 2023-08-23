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

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`listening on port: http://localhost:${PORT}`);
})