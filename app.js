const express = require('express');
const app = express();
const {authentication,termManagament,subjectManagament} = require('./routes/index');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use('/',authentication);
app.use('/',termManagament);
app.use('/',subjectManagament);

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`listening on port: http://localhost:${PORT}`);
})