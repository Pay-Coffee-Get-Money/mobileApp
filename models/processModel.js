const {db} = require('../config');

const processModel = {
    async createProcess(topicId, topicInfs){
        try{
            const process = {
                topicId,
                topic: topicInfs,
                stage_process:[
                    {
                        stage: 1,
                        date: "",
                        content: "Vẽ sơ đồ ERD",
                        isDone: false
                    }, 
                    {
                        stage: 2,
                        date: "",
                        content: "Vẽ UserCase",
                        isDone: false
                    },
                    {
                        stage: 3,
                        date: "",
                        content: "Code Back-End",
                        isDone: false
                    },
                    {
                        stage: 4,
                        date: "",
                        content: "Thiết kế UI/UX",
                        isDone: false
                    },
                    {
                        stage: 5,
                        date: "",
                        content: "Code Front-End",
                        isDone: false
                    }
                ]
            }
            const result =  await db.collection("processes").doc().set(process);
            return {code: 0, msg: 'Successfully creating process'}
        }catch(err){
            return {code: 1, msg: err}
        }
    },
    async updateProcess(processId, data){
        try{
            const result =  await db.collection("processes").doc(processId).update(data);
            return {code: 0, msg: 'Successfully updating process'}
        }catch(err){
            return {code: 1, msg: err}
        }
    }
}

module.exports = processModel;