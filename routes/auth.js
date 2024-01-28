const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const errorHandler = require('../middlewares/errorHandler')
require('dotenv').config();

router.post('/sign-up', async(req,res)=>{
    try{
        const { name, email, password } = req.body;
        if( !name || !email || !password ){
            return res.status(400).json({
                error: 'provide all the required fields'
            });
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(409).json({
                error: 'User already exists'
            })
        }
        const ePass = await bcrypt.hash(password,10);
        await User.create({ name, email, password: ePass });
        res.status(201).json({
            message: 'User signed up successfully',
            User_Name: req.body.name,
        });
    }catch(error){
        errorHandler(res,error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                error: "please provide the details"
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                error: "User not found"
            });
        }
        const passCompare = await bcrypt.compare(password, user.password);
        if (!passCompare) {
            return res.status(401).json({
                error: "Invalid password"
            });
        }
        const token = jwt.sign(
            { userId: user._id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({
            message: "login Success",
            User_Name: user.name,
            token,
        });
    } catch (error) {
        errorHandler(res,error);
    }
});


module.exports = router;