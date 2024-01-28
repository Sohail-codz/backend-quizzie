const jwt = require('jsonwebtoken');
require('dotenv').config();

const authHandler = (req,res,next)=>{
    const { token } = req.headers;

    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(req.user);
        next();
    }
    catch(error){
        return res.status(401).json({
            error: 'Unauthorized',
        });
    }
}

module.exports = authHandler;