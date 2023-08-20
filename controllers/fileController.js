const fileController = {
    importFile(req,res){
        res.json(req.result);
    },
    exportFile(req,res){
        if(req.result.code == "Type error" || req.result.code == 2){
            res.json(req.result);
        }else{
            res.sendFile(req.result);
        }
    }
}

module.exports = fileController;