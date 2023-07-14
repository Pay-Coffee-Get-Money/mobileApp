const express = require('express');
const app = express();
const {signIn_UpRoute} = require('./routes/index');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use('/',signIn_UpRoute);
app.use('/test', (req, res) => {
    res.send('test');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`listening on port: http://localhost:${PORT}`);
})