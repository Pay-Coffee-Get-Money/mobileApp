const fileController = {
    importFile(req,res){
        res.json(req.result);
    },
    exportFile(req,res){
        if(req.result.code == "Type error"){
            res.json(req.result);
        }
        res.sendFile(req.result);
    }
}

module.exports = fileController;