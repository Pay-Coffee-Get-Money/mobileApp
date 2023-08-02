const express = require('express');
const route = express.Router();
const subjectController = require('../controllers/subjectController');
const multer = require('multer');
const path = require('path');

// Cấu hình Multer và định nghĩa thư mục để lưu trữ tệp tải lên
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, "./src/fileUploads"); // Thư mục lưu trữ tệp tải lên
    },
    filename: function (req, file, cb) {
      return cb(null, file.originalname); // Lưu tên tệp gốc
    }
});

// Kiểm tra loại tệp trước khi tải lên
const fileFilter = (req, file, cb) => {
    const filetypes = /xlsx|xls|xlsb|xlsm/; // Danh sách các kiểu MIME của tệp Excel
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true); // Cho phép tải lên
    } else {
      cb(JSON.stringify({code:"Error uploading",message:"'Only .xlsx, .xls, .xlsb, .xlsm files are accepted"}), false); // Từ chối tải lên
    }
};
  
const upload = multer({ storage,fileFilter});

route.post('/subject/create', subjectController.createSubject);
route.get('/subject', subjectController.readSubject);
route.get('/subject/getSubjectById', subjectController.getSubjectById);
route.put('/subject/update', subjectController.updateSubject);
route.delete('/subject/delete', subjectController.deleteSubject);
route.post('/subject/createByFile', upload.single("file"), subjectController.uploadExcel);
route.get('/subject/createByFile', subjectController.exportExcel);

module.exports = route;