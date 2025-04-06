const { Router } = require('express');
const router = Router();
const User = require('../models/user');
const refSch = require('../models/referral');


router.get('/create-referral',(req,res)=>{
    if(req.user && req.user.role === "ADMIN"){
        return res.status(200).render('createRef');
    }
    return res.status(200).send("you need admin permission to access this page");
})

router.post('/createref',async (req,res)=>{
    if(!req.user && !req.user.role === "ADMIN"){
        return res.status(200).send("you need admin permission to access this page");
    }
    const {fullName,phone,ref} = req.body;
    let referral = ref.toLowerCase().trim();
    try{
        let ref = await refSch.findOne({referral : referral});
        let ref2 = await refSch.findOne({phone : phone});
        if(ref2){
            return res.status(200).send("for this number referral already generated");
        }
        if(ref){
            return res.status(200).send("this referral code already exist");
        }
        await refSch.create({
            fullName,
            phone,
            referral
        })
        return res.status(200).send("referral created successfully");
    }
    catch(err){
        return res.status(401).send(err);
    }
})

router.post('/referrals', async (req, res) => {
    let user = await User.find({});
    let { referral } = req.body;
    referral = referral.toLowerCase();
    let refs = await refSch.findOne({referral : referral});
    if(!refs){
        return res.send({len : 0,users : {},paidUsers : 0,err : "referral does not exist"});
    }
    const users = user.filter(user => user.referral.toLowerCase() === referral);
    let paidUsers = 0;
    let usersData = users.map(user => {
        if(user.subscribed){
            paidUsers++;
        }
        return {
            "name" : user.firstName,
            "isPaid" : user.subscribed
        }
    }
    );
    return res.status(200).send({ len: users.length, users: usersData,paidUsers });
})

module.exports = router;