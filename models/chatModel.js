const {admin} = require('../config');

const chatModel = {
    async createChatRoom(subjectId,userIds){
        try{
            const chatRef = admin.database().ref('ChatRooms');

            // Tạo phòng chat cho subject vào Realtime Database
            const chatRoomItem = {
                subjectId,
                chat: ["empty_message"],
                timestamp: admin.database.ServerValue.TIMESTAMP
            };
            //Kiểm tra có phải phòng chat 1vs1 không
            if(userIds){
                chatRoomItem.userIds = userIds;
            }
            // Thêm dữ liệu vào Realtime Database và lấy tham chiếu
            const newChatRef = await chatRef.push(chatRoomItem);

            // Lấy ID của phòng chat vừa tạo
            const newChatId = newChatRef.key;
            return newChatId;
        }catch(err){
            return {code: 1, msg: "Error creating chat room "+err}
        }
    },
    async getAllChatRoomsInSubject(subjectId,userId){
        try{
            const database = admin.database();
            const chatRoomsRef = database.ref('ChatRooms');

            const snapshot = await chatRoomsRef.once('value');
            let chatRooms = [];

            snapshot.forEach(childSnapshot => {
                if(childSnapshot.val().subjectId == subjectId){
                    chatRooms.push({
                        ...childSnapshot.val(),
                        id : childSnapshot.key
                    });
                }  
            });
            if (chatRooms ) {
                let data = [];
                await Promise.all(
                    chatRooms.map(async (chatRoom)=>{
                        if(chatRoom.chat[0] !== "empty_message"){
                            data = await Promise.all(chatRoom.chat.map(async (msg) => {
                                const userId = msg.userId;
                                const userModel = require('./userModel');
            
                                const userInf = await userModel.getUserById(userId); // Await the getUserById function
                                msg.userInf = userInf;
            
                                return msg; // Return the modified message object
                            }));
                            chatRoom.chat = data;
                        }
                    })
                )

                chatRooms = chatRooms.filter((item) => {
                    if (item.userIds) {
                        return item.userIds.includes(userId); // Kiểm tra xem userId có trong mảng userIds hay không
                    }
                    return true; // Trường hợp không có userIds, giữ lại phần tử
                });
                

                return chatRooms;
            } else {
                return { code: 2, msg: 'Chat room not found' };
            }

        }catch(err){
            return {code: 1, msg: 'Chat room getting error, '+err};
        }
    },
    async sendMsg(chatRoomId,userId,msg){
        try{
            const database = admin.database();
            const chatRoomsRef = database.ref('ChatRooms');

            //Lấy đoạn chat cũ sau đó thêm msg mới vào
            const snapshot = await chatRoomsRef.child(chatRoomId).child('chat').once('value');
            if(snapshot){
                const oldMsg = snapshot.val();
                const newMessage = {
                    userId, 
                    message: msg,
                    timestamp: admin.database.ServerValue.TIMESTAMP,
                }
                return oldMsg;
                if(oldMsg[0] === 'empty_message'){
                    await chatRoomsRef.child(chatRoomId).child('chat').update([newMessage]);// Thêm tin nhắn mới
                }else{
                    await chatRoomsRef.child(chatRoomId).child('chat').update([...oldMsg,newMessage]);// Thêm tin nhắn mới vào tin nhắn cũ
                }

                return {code: 0, msg: 'Message send successfully'};
            }else{
                return {code: 2, msg: 'Chat room not found'};  
            }
        }catch(err){
            console.log(err);
            return {code: 1, msg: 'Send message error, '+err};
        }
    }
}

module.exports = chatModel;
