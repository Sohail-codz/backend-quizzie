const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/userModel');
const authRouter = require('./routes/auth')
dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use('/',authRouter);

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

app.get('/users', async (req,res)=>{
    try{
        let users = await User.find({})
        res.json({
            Message: 'Users',
            data: users,
        })
    }catch(error){
        console.log(error)
        res.json({
            status: 'fail',
            message: 'something went wrong',
        })
    }
})

//error-handler
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
    });
});

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






