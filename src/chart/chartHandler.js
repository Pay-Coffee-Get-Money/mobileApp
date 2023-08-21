const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const path = require('path');

const chartHandler = {
    createChart(labels,dataNumbers,number_of_student_in_subject){
        // Tạo một canvas để vẽ biểu đồ
        const width = 800;
        const height = 800;
        const canvasRenderService = new ChartJSNodeCanvas({width, height, chartCallback: (ChartJS) => {}});

        // Dữ liệu cho biểu đồ
        const data = {
            labels: labels,
            datasets: [
                {
                    label: `Biểu đồ thống kê số sinh viên đăng ký/n với tổng số sinh viên trong môn học là ${number_of_student_in_subject}`,
                    data: dataNumbers,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };

        // Cấu hình biểu đồ
        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        };

        // Render biểu đồ 
        (async () => {
            const image = await canvasRenderService.renderToBuffer(config);
            fs.writeFileSync('./src/chart/chartImgs/line-chart.png', image);
        })();

        const filePath = path.join(path.join(__dirname, '../chart/chartImgs/line-chart.png'));
        return filePath
    }
}
 
module.exports = chartHandler;