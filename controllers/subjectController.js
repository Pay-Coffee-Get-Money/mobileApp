const subjectModel = require('../models/subjectModel');
const xlsx = require('xlsx');
const path = require('path');

const subjectController = {
    async createSubject (req,res){
        const subjectInfors = req.body;
        const result = await subjectModel.createSubject(subjectInfors);
        res.json(result);
    },
    async readSubject (req,res){
        const data = await subjectModel.readSubject();
        res.json(data);
    },
    async updateSubject (req,res){
        const {id,...newSubjectInfors} = req.body;
        const result = await subjectModel.updateSubject(id,newSubjectInfors);
        res.json(result);
    },
    async deleteSubject(req, res) {
        const id = req.body.id;
        const result = await subjectModel.deleteSubject(id);
        res.json(result);
    },
    async getSubjectById(req, res) {
        const id = req.body.id;
        const result = await subjectModel.getSubjectById(id);
        res.json(result);
    },
    uploadExcel(req, res){
        //Lấy dữ liệu từ file excel đã upload lên
        const excelData = subjectController.readSubjectsFromExcelFile(req.file);
        //Từ dữ liệu đã lấy được lần lượt tạo môn học vào DB theo từng phần tử của mảng
        excelData.forEach(async (item) => {
            const result = await subjectModel.createSubject(item);
            if(result.code !== 0){
                res.json(result);
            }
        })
        res.json({code:0,message:"Successful upload"});
    },
    readSubjectsFromExcelFile(file){
        // Tên tệp Excel cần đọc
        const filename = file.filename;

        // Đọc tệp Excel
        const workbook = xlsx.readFile(`./src/fileUploads/${filename}`);

        // Lấy danh sách tên các sheet trong tệp Excel
        const sheetNames = workbook.SheetNames;

        // Chọn sheet cần đọc (chúng ta sẽ đọc sheet đầu tiên)
        const firstSheetName = sheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Biến worksheet thành mảng các đối tượng
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Xuất dữ liệu
        return data;
    },
    async exportExcel(req,res){
        // Dữ liệu bạn muốn viết vào tệp Excel
        let data = await subjectModel.readSubject();
        //loại trường ID ra khỏi item của mảng 
        data = data.map((item,index)=>{
            return item = data[index].subjectInfors;
        })

        console.log(data)
        // Tạo một workbook mới
        const workbook = xlsx.utils.book_new();
        
        // Tạo một worksheet mới
        const worksheet = xlsx.utils.json_to_sheet(data);
        
        // Thêm worksheet vào workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        
        // Ghi workbook vào tệp Excel
        const fileExportPath = './src/fileExport/Subject_Export.xlsx'; // Đường dẫn và tên tệp Excel sẽ được viết
        xlsx.writeFile(workbook, fileExportPath);
        const filePath = path.join(path.join(__dirname, '../src/fileExport/Subject_Export.xlsx'));
        res.sendFile(filePath);
    }
}

module.exports = subjectController;