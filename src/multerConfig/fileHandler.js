const xlsx = require('xlsx');
const path = require('path');
const subjectModel = require('../../models/subjectModel');

const fileHandler = {
    importExcelFile(file){
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
    handle_import_files(req,res,next){
        const type = req.body.typeModel;
        const rsTypeChecking = fileHandler.checkType(type,'import'); //Kiểm tra loại model được gửi lên server để lấy được model và method tương ứng để xử dụng
        if(rsTypeChecking.code == "Type error"){
            req.result = rsTypeChecking;
            next();
        }else{
            const excelData = fileHandler.importExcelFile(req.file);
            const model = rsTypeChecking.model;
            const method = rsTypeChecking.method;
            //Từ dữ liệu đã lấy được lần lượt tạo đối tượng tương ứng vào DB theo từng phần tử của mảng
            excelData.forEach(async (item) => {
                const result = await model[method](item);
                if(result.code !== 0){
                    req.result = result;
                    next();
                }
            })
            req.result = {code:0,message:"Successful upload"};
            next();
        }
    },
    async handle_export_files(req,res,next){
        const type = req.body.typeModel;
        const rsTypeChecking = fileHandler.checkType(type,'export');  //Kiểm tra loại model được gửi lên server để lấy được model và method tương ứng để xử dụng
        if(rsTypeChecking.code == "Type error"){                      //Trả về lỗi nếu loại model không có 
            req.result = rsTypeChecking;
            next();
        }else{
            const model = rsTypeChecking.model;
            const method = rsTypeChecking.method;

            // Dữ liệu bạn muốn viết vào tệp Excel
            let data = await model[method]();

            //loại trường ID ra khỏi item của mảng 
            data = data.map((item,index)=>{
                const {id, ...infors} = item;
                return item = infors;
            })        

            // Tạo một workbook mới
            const workbook = xlsx.utils.book_new();
            
            // Tạo một worksheet mới
            const worksheet = xlsx.utils.json_to_sheet(data);
            
            // Thêm worksheet vào workbook
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            
            // Ghi workbook vào tệp Excel
            const fileExportPath = './src/fileExport/File_Export.xlsx'; // Đường dẫn và tên tệp Excel sẽ được viết
            xlsx.writeFile(workbook, fileExportPath);
            const filePath = path.join(path.join(__dirname, '../fileExport/File_Export.xlsx'));
            req.result = filePath;
            next();
        }
    },
    checkType(type,operation){
        switch(type.toLowerCase()){
            case 'subject':
                return {
                    model: subjectModel,
                    method: operation !== "import" ? 'readSubject' : 'createSubject'
                }
            default:
                return {code: "Type error", message: "This type is not available"};
        }
    }
}

module.exports = fileHandler;
 