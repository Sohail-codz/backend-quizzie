const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors')
dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.get('/',(req,res)=>{
    res.send('hello this is the default route for quizzie')
})

app.get('/health',(req,res)=>{
    res.status(200).json({
        service: 'Quizzie Backend Server',
        status: 'Active',
        time: new Date(),
    })
})

app.listen(PORT,()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log(`Server is running on http://localhost:${PORT}`);
    }).catch((error)=>{
        console.log(error);
    })
})