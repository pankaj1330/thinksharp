const { Router } = require('express');
const path = require('path')
const router = Router();


router.get('/login', (req, res) => {
    return res.status(200).render('login');
})

router.get('/signup', (req, res) => {
    return res.status(200).render('signup');
})

router.get('/forgotpassword', (req, res) => {
    return res.status(200).render('forgetPassword');
})

router.get('/coming-soon', (req, res) => {
    if(req.user && req.mcq){
        return res.status(200).render('comingsoon',{
            user: req.user,
        })
    }
    return res.status(200).render('comingsoon');
})

router.get('/categories', (req, res) => {
    if(req.user && req.mcq){
        return res.status(200).render('category',{
            user: req.user,
        })
    }
    return res.status(200).render('category');
})

router.get('/games',(req,res)=>{
    if(req.user && req.mcq){
        return res.status(200).render('games/gamescategory',{
            user : req.user,
        })
    }
    return res.status(200).render('games/gamescategory');
})


router.get('/referral',(req,res)=>{
    return res.status(200).render('referral');
})

router.get('/aboutus',(req,res)=>{
    if(req.user && req.mcq){
        return res.status(200).render('footer/aboutus',{
            user : req.user,
        })
    }
    return res.status(200).render('footer/aboutus');
})
router.get('/contact-us',(req,res)=>{
    if(req.user && req.mcq){
        return res.status(200).render('footer/contact',{
            user : req.user,
        })
    }
    return res.status(200).render('footer/contact');
})
router.get('/missionAndVision',(req,res)=>{
    if(req.user && req.mcq){
        return res.status(200).render('footer/mission',{
            user : req.user,
        })
    }
    return res.status(200).render('footer/mission');
})
router.get('/privacyPolicy',(req,res)=>{
    if(req.user && req.mcq){
        return res.status(200).render('footer/privacyPolicy',{
            user : req.user,
        })
    }
    return res.status(200).render('footer/privacyPolicy');
})
router.get('/science',(req,res)=>{
    if(req.user && req.mcq){
        return res.status(200).render('footer/science',{
            user : req.user,
        })
    }
    return res.status(200).render('footer/science');
})
router.get('/support',(req,res)=>{
    if(req.user && req.mcq){
        return res.status(200).render('footer/support',{
            user : req.user,
        })
    }
    return res.status(200).render('footer/support');
})
router.get('/termsOfService',(req,res)=>{
    if(req.user && req.mcq){
        return res.status(200).render('footer/termsOfService',{
            user : req.user,
        })
    }
    return res.status(200).render('footer/termsOfService');
})
router.get('/faq',(req,res)=>{
    if(req.user && req.mcq){
        return res.status(200).render('faq',{
            user : req.user,
        })
    }
    return res.status(200).render('faq');
})

router.get('/ebooks',(req,res)=>{
    if(req.user && req.mcq && req.user.getEbooks){
        return res.status(200).render('ebooks',{
            user : req.user,
        })
    }
    return res.status(200).render('err');
})


module.exports = router;