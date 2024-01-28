const mongoose = require('mongoose');
const QuizQuestion = require('./quizModel');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
    },
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizQuestion',
    }],
})

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;