const express = require('express');
const route = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../src/multerConfig/multerConfig');
const fileHandler = require('../src/multerConfig/fileHandler');

route.post('/file/:model',   
    upload.single("file"),              //upload file vào storage 
    fileHandler.handle_import_files,    //lấy dữ liệu từ file rồi xử lý sau đó đưa vào database 
    fileController.importFile           //Xuất kết quả trả về 
);

route.get('/file/:model', 
    fileHandler.handle_export_files,    //lấy dữ liệu từ database sau đó đưa vào file excel 
    fileController.exportFile           //Trả về đường dẫn file cho người dùng tải về
);

route.get('/file/:model/:subjectId',               //Nếu muốn export ra ds sinh viên có trong môn học thì thêm /subjectId
    fileHandler.handle_export_files,    //lấy dữ liệu từ database sau đó đưa vào file excel 
    fileController.exportFile           //Trả về đường dẫn file cho người dùng tải về
);

module.exports = route;