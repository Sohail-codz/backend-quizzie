const express = require('express');
const router = express.Router();
const QuizQuestion = require('../models/quizModel');
const User = require('../models/userModel');
const errorHandler = require('../middlewares/errorHandler');
const authHandler = require('../middlewares/authHandler');

router.post('/create-quiz', authHandler, async (req, res) => {
    try {
        const { quizName, quizType, questions } = req.body;

        if (!quizName || !quizType || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: 'Invalid request parameters' });
        }

        const formattedQuestions = questions.map((question) => {
            const {
                questionNumber,
                questionText,
                optionType,
                options,
                timer,
            } = question;

            let formattedOptions = [];

            switch (optionType) {
                case 'text':
                    if (!options || !Array.isArray(options) || options.length < 2 || options.length > 4) {
                        throw new Error('Invalid options for text type');
                    }
                    formattedOptions = options.map(option => ({ text: option.text }));
                    break;

                case 'image':
                    if (!options || !Array.isArray(options) || options.length < 2 || options.length > 4) {
                        throw new Error('Invalid options for image type');
                    }
                    formattedOptions = options.map(option => ({ imageUrl: option.imageUrl }));
                    break;

                case 'textAndImage':
                    if (!options || !Array.isArray(options) || options.length < 2 || options.length > 4) {
                        throw new Error('Invalid options for textAndImage type');
                    }
                    formattedOptions = options.map(({ text, imageUrl }) => ({ text, imageUrl }));
                    break;

                default:
                    throw new Error('Invalid option type');
            }

            return {
                questionNumber,
                questionText,
                optionType,
                options: formattedOptions,
                timer,
            };
        });

        const createdQuiz = await QuizQuestion.create({
            user: req.user.userId,
            quizName,
            quizType,
            questions: formattedQuestions,
        });

        await User.findByIdAndUpdate(req.user.userId, { $push: { quizzes: createdQuiz._id } });

        res.status(201).json({
            message: 'Quiz created successfully',
            quiz: createdQuiz,
        });
    } catch (error) {
        errorHandler(res, error);
    }
});

router.delete('/delete-quiz/:quizId', authHandler, async (req,res)=>{
    try{
        const quizId = req.params.quizId;
        const quiz = await QuizQuestion.findById(quizId) ;
        if(!quiz){
            return res.status(404).json({error: 'quiz not found'});
        }
        if(quiz.user.toString() !== req.user.userId){
            return res.status(403).json({error: 'Unauthorized to delete the quiz'});
        }
        await QuizQuestion.findByIdAndDelete(quizId);

        await User.findByIdAndUpdate(req.user.userId, { $pull: { quizzes: quizId} });

        res.status(200).json({ message: 'Quiz deleted successfully' })
    }
    catch(error){
        errorHandler(res,error);
    }
});

router.put('/edit-quiz/:quizId/:questionNumber', authHandler, async (req,res)=>{
    try{
        const quizId = req.params.quizId;
        const questionNumber = req.params.questionNumber;
        const { questionText, options } = req.body;

        if(!questionText || !options || !Array.isArray(options)){
            return res.status(400).json({ error: 'Invalid request parameters' });
        }
        const quiz = await QuizQuestion.findById(quizId);
        if(!quiz){
            return res.status(404).json({error: 'Quiz not found'});
        }
        if (quiz.user.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized to edit the quiz' });
        }
        const updatedQuestions = quiz.questions.map((originalQuestion) => {
            if (originalQuestion.questionNumber === questionNumber) {
                return {
                    ...originalQuestion,
                    questionText,
                    options,
                };
            }
            return originalQuestion;
        });

        quiz.questions = updatedQuestions;
        await quiz.save();

        res.status(200).json({message: 'Quiz updated successfully', quiz: quiz})

    }catch(error){
        errorHandler(res,error);
    }
})

router.get('/quiz/:quizId', async (req,res)=>{
    const { quizId } = req.params;
    
    try{
        const quiz = await QuizQuestion.findById(quizId);
        if(!quiz){
            res.status(404).json({
                error: 'Quiz not found'
            })
        }
        const quizData = {
            _id: quiz._id,
            user: quiz.user,
            quizName: quiz.quizName,
            quizType: quiz.quizType,
            questions: quiz.questions,
            createdAt: quiz.createdAt,
        };
        res.json({quiz: quizData})
    }catch(error){
        errorHandler(res,error);
    }
})

module.exports = router;