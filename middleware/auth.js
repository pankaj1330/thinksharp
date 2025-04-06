const {verifyToken} = require('../services/auth');
const User = require('../models/user');
const { generateToken,generateMcqToken} = require('../services/auth');
const MCQ = require('../models/mcq');

function authenticateUser(){
    return (req,res,next) => {
        const token = req.cookies["token"];
        const mcqtoken = req.cookies["mcqtoken"];
        if(!token && !mcqtoken){
            return next();
        }
        try{
            const userPayload = verifyToken(token);
            req.user = userPayload;
            if(mcqtoken){
                const mcqPayload = verifyToken(mcqtoken);
                req.mcq = mcqPayload;
            }
        }
        catch(err){
            console.log(err);
        }

        return next();
    }
}

function isLoggedIn(req,res,next){
    if(!req.user || !req.mcq){
        return res.status(302).redirect('/login');
    }
    return next();
}
async function isPaid(req,res,next){
    if(!req.user || !req.mcq){
        return res.status(302).redirect('/login');
    }
    else if(!req.user.subscribed){
        return res.status(302).redirect('/#pay-section');
    }
    else if(new Date(req.user.endDate).getTime() < new Date(Date.now()).getTime()){
        await User.findByIdAndUpdate(req.user._id,{
            $set : {
                subscribed : false
            }
        })
        let user = await User.findById(req.user._id);
        const usertoken = generateToken(user);
        res.cookie("token",usertoken,{ expires : new Date(Date.now() + (60*60*24*30*1000))});
        return res.status(302).redirect('/#pay-section');
    }
    return next();
}

async function updateCookie(req,res,next){
    if(!req.user && !req.mcq){
        return next();
    }
    else if(!req.user || !req.mcq){
        return res.status(302).redirect('/login');
    }
    else{
        let user = await User.findById(req.user._id);
        let mcq = await MCQ.findById(req.mcq._id);
        const usertoken = generateToken(user);
        const mcqtoken = generateMcqToken(mcq);
        res.cookie("token",usertoken,{ expires : new Date(Date.now() + (60*60*24*30*1000))});
        res.cookie("mcqtoken",mcqtoken,{ expires : new Date(Date.now() + (60*60*24*30*1000))});
        return next();
    }

}

module.exports = {authenticateUser,isLoggedIn,isPaid,updateCookie};