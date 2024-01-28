const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
     user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
     },
     quizName:{
        type: String,
        required: true,
     },
     quizType:{
        type: String,
        required: true,
        enum: ['Q&A','POLL'],
     },
     questions: [{
        questionNumber: {
            type: Number,
            required: true,
        },
        questionText: {
            type: String,
            required: true,
        },
        optionType: {
            type: String,
            enum: ['text', 'image', 'textAndImage'],
            required: true,
        },
        options: [{
            text: String,
            imageUrl: String,
            correct: {
                type: Boolean,
                default: false, 
            },
        }],
        timer: {
            type: String,
            enum: ['5sec', '10sec', 'off'],
            required: true,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const quizModel = mongoose.model('QuizQuestion',quizSchema);

module.exports = quizModel;