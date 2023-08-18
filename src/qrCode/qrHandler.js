const qr = require('qrcode');;

const qrHandler = {
    async createQR(data){
        try{
            const qrCode =  await qr.toDataURL(data);
            return qrCode
        }catch(err){
            return {code: 1, msg: err};
        }
    }
}

module.exports = qrHandler;