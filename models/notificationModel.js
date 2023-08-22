const {db,admin} = require('../config');

const notificationModel ={
    async createNotify(infors){
        try{
            const notificationsRef = admin.database().ref('notifications');

            // Gửi thông báo mới vào Realtime Database
            const newNotification = {
                ...infors,
                timestamp: admin.database.ServerValue.TIMESTAMP,
            };
            await notificationsRef.push(newNotification);
            return {code: 0, msg: 'Notification has been sent'};
        }catch(err){
            return {code: 1, msg: 'Notification has not been sent, '+err};
        }
    },
    async readNotify(){
        try{
            const notificationsRef = admin.database().ref('notifications');
            const snapshot = await notificationsRef.once('value');
            const notifications = [];
        
            snapshot.forEach(childSnapshot => {
              const notification = childSnapshot.val();
              notification.id = childSnapshot.key;
              notifications.push(notification);
            });
            return notifications;
        }catch(err){
            return {code: 1, msg: 'Notification getting error, '+err};
        }
    },
    async getNotifyById(notifyId){
        try{
            const database = admin.database();
            const notificationsRef = database.ref('notifications');

            const snapshot = await notificationsRef.child(notifyId).once('value');
            const notification = snapshot.val();
            notification.id = snapshot.key;
            if (notification) {
                return notification;
            } else {
                return {code: 2, msg: 'Notification not found'};  
            }
        }catch(err){
            return {code: 1, msg: 'Notification getting error, '+err};
        }
    },
    async updateNotify(notifyId,newInfors){
        try {
            const database = admin.database();
            const notificationsRef = database.ref('notifications');
    
            // Lấy thông báo theo ID
            const snapshot = await notificationsRef.child(notifyId).once('value');
            const notification = snapshot.val();
    
            if (notification) {    
                // Cập nhật thông báo trong cơ sở dữ liệu
                await notificationsRef.child(notifyId).update(newInfors);
                
                return {code: 0, msg: 'The notification has been updated successfully'};
            } else {
                return {code: 2, msg: 'Notification not found'};  
            }
        } catch (err) {
            return {code: 1, msg: 'Notification updating error, '+err};
        }
    },
    async deleteNotify(id){
        try {
            const database = admin.database();
            const notificationsRef = database.ref('notifications');
    
            // Lấy thông báo theo ID
            const snapshot = await notificationsRef.child(id).once('value');
            const notification = snapshot.val();
    
            if (notification) {
                // Xóa thông báo khỏi cơ sở dữ liệu
                await notificationsRef.child(id).remove();
                
                return {code: 0, msg: 'The notification has been deleted successfully'};
            } else {
                return {code: 2, msg: 'Notification not found'};  
            }
        } catch (err) {
            return {code: 1, msg: 'Notification deleting error, '+err};
        }
    }
}

module.exports = notificationModel;