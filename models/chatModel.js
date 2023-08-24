const {admin} = require('../config');

const chatModel = {
    async createChatRoom(subjectId){
        try{
            const chatRef = admin.database().ref('ChatRooms');

            // Tạo phòng chat cho subject vào Realtime Database
            const chatRoomItem = {
                subjectId,
                chat: ["empty_message"],
                timestamp: admin.database.ServerValue.TIMESTAMP,
            };
            // Thêm dữ liệu vào Realtime Database và lấy tham chiếu
            const newChatRef = await chatRef.push(chatRoomItem);

            // Lấy ID của phòng chat vừa tạo
            const newChatId = newChatRef.key;
            return newChatId;
        }catch(err){
            return {code: 1, msg: "Error creating chat room "+err}
        }
    },
    async getChatRoomBySubjectId(subjectId){
        try{
            const database = admin.database();
            const chatRoomsRef = database.ref('ChatRooms');

            const snapshot = await chatRoomsRef.once('value');
            let chatRooms = {};

            snapshot.val();
            snapshot.forEach(childSnapshot => {
                if(childSnapshot.val().subjectId == subjectId){
                    chatRooms = childSnapshot.val();
                    chatRooms.id = childSnapshot.key;
                }  
            });
            if (chatRooms) {
                return chatRooms;
            } else {
                return {code: 2, msg: 'Chat room not found'};  
            }
        }catch(err){
            return {code: 1, msg: 'Chat room getting error, '+err};
        }
    },
    async sendMsg(subjectId,userId,msg){
        try{
            const database = admin.database();
            const chatRoomsRef = database.ref('ChatRooms');

            //Lấy đoạn chat cũ sau đó thêm msg mới vào
            const chatRoom = await this.getChatRoomBySubjectId(subjectId);
            if (chatRoom) {    
                // Cập nhật chat trong cơ sở dữ liệu
                const newMessage = {
                    userId, 
                    message: msg,
                    timestamp: admin.database.ServerValue.TIMESTAMP,
                }
                const newMessageIndex = Object.keys(chatRoom.chat).length;
                if(chatRoom.chat[0] == "empty_message"){
                    chatRoom.chat[0] = newMessage; // Thêm tin nhắn mới
                }else{
                    chatRoom.chat[newMessageIndex] = newMessage; // Thêm tin nhắn mới vào mảng chat cũ
                }
                // Cập nhật lại mảng chat trong cơ sở dữ liệu
                await chatRoomsRef.child(chatRoom.id).update({ chat: chatRoom.chat });
                return {code: 0, msg: 'Message send successfully'};
            } else {
                return {code: 2, msg: 'Chat room not found'};  
            }
        }catch(err){
            console.log(err)
            return {code: 1, msg: 'Send message error, '+err};
        }
    }
}

module.exports = chatModel;