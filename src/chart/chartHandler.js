const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const path = require('path');

const chartHandler = {
    createChart(dataNumbers){
        console.log(dataNumbers)
        // Tạo một canvas để vẽ biểu đồ
        const width = 800;
        const height = 800;
        const canvasRenderService = new ChartJSNodeCanvas({ width, height, chartCallback: (ChartJS) => {} });

        // Dữ liệu cho biểu đồ
        const data = {
            labels: ['Đã đăng ký thành công', 'Chưa đăng ký', 'Chờ duyệt'],
            datasets: [
                {
                    data: dataNumbers,
                    backgroundColor: ['green', 'gray', 'blue'], // Tùy chọn màu sắc
                },
            ],
        };

        // Cấu hình biểu đồ
        const config = {
            type: 'pie',
            data: data,
            options: {
                responsive: false,
            },
        };

        // Render biểu đồ
        (async () => {
            const image = await canvasRenderService.renderToBuffer(config);
            fs.writeFileSync('./src/chart/chartImgs/pie-chart.png', image);
        })();

        const filePath = path.join(__dirname, '../chart/chartImgs/pie-chart.png');
        return filePath;
    }
}
 
module.exports = chartHandler;