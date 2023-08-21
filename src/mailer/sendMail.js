const nodemailer = require('nodemailer');

const sendMail = async (mail,data,type)=>{
    let html = getHtmlByType(data,type);
    if(html.code !== 0){
        return html;
    }
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
        to: mail,
        subject: 'NOTIFICATION',
        html: html.htmls
    };
    
    // Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        return { code: 0, msg: 'Success in sending notification'};
    } catch (error) {
        return { code: 'Mailer error', msg: error.message };
    }
}

const getHtmlByType = (data,type) =>{
    switch(type){
        case 1:
            if(!data.groupQr && !data.subjectName){
                return {code: "Error", msg: "Some fileds data is invalid"};
            }else{
                return {
                    code: 0,
                    htmls: `
                        <div style='width: 500px;background: white;border: 1px solid;box-shadow: 1px 1px 2px; padding: 10px 20px;text-align: center;'>
                            <h1>Lời mời tham gia nhóm trong lớp ${data.subjectName}</h1>
                            <img src="${data.groupQr}" alt="QRImg" />
                        </div>
                    `
                };
            } 
        case 2:
        case 3:
        default:
            return {code: "Type error", msg: "Type is invalid"};
    }
}

module.exports = sendMail;
