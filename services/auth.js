require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

function generateToken(user){
    const payload = {
        _id : user._id,
        firstName : user.firstName,
        lastName : user.lastName,
        dob : user.dob,
        phone : user.phone,
        gender : user.gender,
        classSection : user.classSection,
        subscribed : user.subscribed,
        subscribedDate : user.subscribedDate,
        endDate : user.endDate,
        getEbooks : user.getEbooks,
        role : user.role
    };

    const token = jwt.sign(payload,secret);
    return token;
}

function verifyToken(token){
    const user = jwt.verify(token,secret);
    return user;
}


function generateMcqToken(mcq){
    const payload = {
        _id : mcq._id,
        qsnSolved : mcq.qsnSolved,
        correct : mcq.correct,
        inCorrect : mcq.inCorrect,
        flashcards : mcq.flashcards,
        quotes : mcq.quotes,
        categories : mcq.categories
    };

    const mcqtoken = jwt.sign(payload,secret);
    return mcqtoken;
}

function verifyMcqToken(token){
    const mcq = jwt.verify(token,secret);
    return mcq;
}

module.exports = {generateToken,verifyToken,generateMcqToken,verifyMcqToken}