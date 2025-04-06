const { Router } = require('express');
const router = Router();



router.get('/card-matching-game',(req,res)=>{
    res.status(200).render('games/CardMatchingGame/8cards.ejs')
})

router.get('/card-matching-game/8cards',(req,res)=>{
    res.status(200).render('games/CardMatchingGame/8cards.ejs')
})
router.get('/card-matching-game/12cards',(req,res)=>{
    res.status(200).render('games/CardMatchingGame/12cards.ejs')
})
router.get('/card-matching-game/16cards',(req,res)=>{
    res.status(200).render('games/CardMatchingGame/16cards.ejs')
})
router.get('/card-matching-game/20cards',(req,res)=>{
    res.status(200).render('games/CardMatchingGame/20cards.ejs')
})
router.get('/card-matching-game/24cards',(req,res)=>{
    res.status(200).render('games/CardMatchingGame/24cards.ejs')
})
router.get('/card-matching-game/28cards',(req,res)=>{
    res.status(200).render('games/CardMatchingGame/28cards.ejs')
})
router.get('/card-matching-game/32cards',(req,res)=>{
    res.status(200).render('games/CardMatchingGame/32cards.ejs')
})
router.get('/card-matching-game/36cards',(req,res)=>{
    res.status(200).render('games/CardMatchingGame/36cards.ejs')
})
router.get('/card-matching-game/40cards',(req,res)=>{
    res.status(200).render('games/CardMatchingGame/40cards.ejs')
})



router.get('/emoji-sequence-game',(req,res)=>{
    res.status(200).render('games/emojiGame/index')
})
router.get('/tic-tac-toe-game',(req,res)=>{
    res.status(200).render('games/TicTacToe/index')
})
router.get('/word-guess-game',(req,res)=>{
    res.status(200).render('games/WordGuessingGame/index')
})
router.get('/word-scramble-game',(req,res)=>{
    res.status(200).render('games/WordScrambleGame/index')
})
router.get('/sudoku-game',(req,res)=>{
    res.status(200).render('games/sudokuGame/index')
})
router.get('/rapid-math',(req,res)=>{
    res.status(200).render('games/rapidMath/index',{
        Class : req.user.classSection
    })
})
module.exports = router;