const nodemailer = require('nodemailer');

const sendMail = async (data)=>{
    let html = getHtmlByType(data);
    // Create a transporter using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'cuBeo2501@gmail.com', // Your email address
            pass: 'cmikalvsewbmxfqb'   // Your email password or app password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    
    // Email content
    const mailOptions = {
        from: 'Notification<cuBeo2501@gmail.com>',
        to: data.email,
        subject: 'NOTIFICATION',
        html: html
    };
    
    // Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        return { code: 0, msg: 'Success in sending notification'};
    } catch (error) {
        return { code: 'Mailer error', msg: error.message };
    }
}

const getHtmlByType = (data) =>{
    return `
        <div>
            <h1 style = 'color : red'>THÔNG BÁO THỜI HẠN NỘP ĐỀ TÀI MÔN ${data.subjectName.toUpperCase()}</h1>
            <p>Hạn cứng : <b style='color : red'>${formatDateToDDMMYYYY(data.deadline_topic)}</b></p>
            <p>Số ngày còn lại : <b style='color : red'>${(data.remaining_days)}</b></p>
        </div>
    `
}

function formatDateToDDMMYYYY(isoDateString) {
    const date = new Date(isoDateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0 (0 - 11)
    const year = date.getFullYear();
    
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}

module.exports = sendMail;
