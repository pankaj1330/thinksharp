const { Router } = require('express');
const MCQ = require('../models/mcq');
const qsns = require('../qsn');
const flashcard = require('../flashcard');
const jokeQuoteFacts = require('../jokeQuoteFacts');
const {generateMcqToken} = require('../services/auth')
const {updateCookie } = require('../middleware/auth');

const router = Router();


router.get('/mcq/:category',updateCookie, async (req, res) => {
    // return res.send(qsns);
    if (!req.user || !req.mcq) {
        return res.status(302).redirect('/login');
    }
    try{
        const category = req.params.category;

        const qsnSolved = req.mcq.categories[category].qsnSolved;
        let currlevel = "1";
        const Class = parseInt(req.user.classSection);

        let group = "";
        if(Class < 2){
            group = "Preschoolers"
            return res.status(200).send({qsn : [],quote : {},currlevel : ""});
        }
        else if(Class >= 2 && Class <= 3){
            group = "EarlyChildhood"
            return res.status(200).send({qsn : [],quote : {},currlevel : ""});
        }
        else if(Class >= 4 && Class <= 6){
            group = "MiddleChildhood"
        }
        else if(Class >= 7 && Class <= 12){
            group = "Adolescents"
        }
        else{
            group = "Adults"
        }

        let quoteNo = parseInt(req.mcq.quotes);
        let quote = "";
        if(jokeQuoteFacts[quoteNo]){
            quote = jokeQuoteFacts[quoteNo]
        }
        else{
            let l = jokeQuoteFacts.length - 1;
            let random = Math.floor(Math.random() * l);
            quote = jokeQuoteFacts[random];
        }
        const qsn = qsns[group][category].slice(qsnSolved,qsnSolved+10);

        if(qsn.length === 0){
            let l = (qsns[group][category].length - 1);
            let random10 = new Set();
            while(random10.size < 10){
                let randomNumber = Math.floor(Math.random() * l);
                random10.add(randomNumber);
            }
            let rand10 = Array.from(random10);
            for(i=0;i<rand10.length;i++){
                qsn.push(qsns[group][category][rand10[i]]);
            }

            // currlevel = "all levels completed"
        }
        currlevel = `Level : ${Math.floor(qsnSolved/10) + 1}`;

        return res.status(200).send({qsn,"quote" : quote.statement,currlevel});
    }
    catch(err){
        return res.status(500).send({qsn : [],quote : {},currlevel : ""});
    }
})

router.get('/mcqs',updateCookie, async (req, res) => {
    if (!req.user || !req.mcq) {
        return res.status(302).redirect('/login');
    }
    return res.status(200).render('mcq', {
        user: req.user,
        Class: req.user.classSection
    });
})


router.put('/submit', async (req, res) => {
    if (!req.user && !req.mcq) {
        return res.status(302).redirect('/login');
    }
    const id = req.mcq._id;
    let noOfquote = req.mcq.quotes;
    let incBy = 0;
    if(noOfquote < jokeQuoteFacts.length){
        incBy = 1
    }
    else{
        incBy = 0
    }
    let userMcq = await MCQ.findById(id);
    if (!userMcq) {
        return res.status(302).redirect('/');
    }
    let { Attempt, Correct, Wrong, category } = req.body;
    try {
        await MCQ.findByIdAndUpdate(id, {
            $inc: {
                qsnSolved: Attempt,
                correct: Correct,
                inCorrect: Wrong,
                quotes : incBy,
                [`categories.${category}.qsnSolved`]: Attempt,
                [`categories.${category}.correct`]: Correct,
                [`categories.${category}.inCorrect`]: Wrong
            }
        });
        const mcq = await MCQ.findOne({solvedBy : req.user._id})
        const mcqtoken = generateMcqToken(mcq);
        res.cookie("mcqtoken",mcqtoken,{ expires : new Date(Date.now() + (60*60*24*30*1000))});
        return res.status(204).end();
    }
    catch (err) {
        return res.status(302).redirect('/');
    }
})

router.get('/flashcards',(req, res) => {
    if(req.user && req.mcq){
        return res.status(200).render('flashcard',{
            user : req.user
        })
    }
    return res.status(302).redirect('/login');
})

router.get('/flashcardData', async (req, res) => {
    if (!req.user || !req.mcq) {
        return res.status(302).redirect('/login');
    }
    try{
        let id = req.mcq._id;
        let mcqSch = await MCQ.findById(id);
        let noOfFlashcard = parseInt(mcqSch.flashcards);
        const flashcards = flashcard.slice(0,noOfFlashcard);
        return res.status(200).send(flashcards);
    }
    catch(err){
        return res.status(500).send([]);
    }
})


module.exports = router