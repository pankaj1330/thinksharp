const { Router } = require('express');
const { generateToken, verifyToken, generateMcqToken} = require('../services/auth');
const User = require('../models/user');
const OTP = require('../models/otp');
const {createHmac,randomBytes} = require('crypto');
const MCQ = require('../models/mcq');
const refSch = require('../models/referral')
const fast2sms = require('fast-two-sms')
const {updateCookie } = require('../middleware/auth');

const router = Router();
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
}


// Function to send OTP via SMS
function sendOTP(mobileNumber ,otp) {

    const option = {
        authorization  : process.env.SMS_KEY,
        message : `Your opt is  : ${otp} DO NOT SHARE it with others
        -TEAM THINKSHARP`,
        numbers : [`${mobileNumber}`]
    }

    fast2sms.sendMessage(option).then(resp => {
        console.log("otp successfully send");
    }).catch(err=>{
        console.log("error ",err);
    })
    return;

}



router.post('/forgotpassword', async (req, res) => {
    const { phone, newpassword, confirmpassword } = req.body;
    if(phone === "" || newpassword === "" || confirmpassword === ""){
        return res.status(200).render('forgetPassword', {
            error: "fill all the required fields"
        })
    }

    if (newpassword !== confirmpassword) {
        return res.status(200).render('forgetPassword', {
            error: "password and confirm password must match"
        })
    }
    if (newpassword.length < 8 ) {
        return res.status(200).render('forgetPassword', {
            error: "password must be atleast 8 characters long"
        })
    }

    const user = await User.findOne({ phone });
    if (!user) {
        return res.status(200).render('forgetPassword', {
            error: "User does not exist"
        })
    }

    let phoneNum = parseInt(phone);
    const otp = generateOTP();


    const otpSch = await OTP.findOne({ phone: phoneNum });
    if (otpSch) {
        await OTP.findOneAndDelete({phone : otpSch.phone});
    }

    await OTP.create({
        otp,
        phone: phoneNum,
        password : newpassword
    })
    sendOTP(phoneNum,otp);

    const token = generateToken(user);
    return res.cookie("token", token,{ expires: new Date(Date.now() + (60*60*24*30*1000)) }).status(200).render('otp');
})

router.post('/verifyopt', async (req, res) => {
    try{
        const enterOpt = req.body.otp;
        const token = req.cookies.token;
        const user = verifyToken(token);
        const phone = user.phone;
        const otpSch = await OTP.findOne({ phone });

        if (!otpSch) {
            return res.status(200).render('otp', {
                error: "time exceeds"
            });
        }

        let password = otpSch.password;
        if (enterOpt == otpSch.otp) {
            const salt = randomBytes(16).toString();
            const hashPassword = createHmac('sha256',salt).update(password).digest('hex');
            await User.findOneAndUpdate({phone : user.phone}, { $set: { salt : salt,password : hashPassword, verified: true } });
            try{
                await OTP.findOneAndDelete({phone : otpSch.phone});
            }
            catch(err){
                return res.status(302).redirect('/login');
            }
            return res.status(302).redirect('/login');
        }
        else {
            return res.status(200).render('otp',{error : "invalid otp"});
        }
    }
    catch(err){
        return res.status(500).render('otp',{
            error : "something went wrong please try again later"
        })
    }
})


router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, dob, phone, password, confirmPassword,email,gender, schoolCode, classSection,referral } = req.body;
        if (firstName === "" || dob === "" || phone === "" || password === "" || confirmPassword === "" || classSection === "",gender === "") {
            return res.status(200).render('signup', {
                error: "fill all the required fields"
            })
        }
        if(gender !== "MALE" && gender !== "FEMALE" && gender !== "OTHER"){
            return res.status(200).render('signup',{
                error : "select your Gender correctly"
            })
        }
        if(password.length < 8){
            return res.status(200).render('signup',{
                error : "password must contain atleast 8 characters"
            })
        }
        if (password !== confirmPassword) {
            return res.status(200).render('signup', {
                error: "password not match with confirm password"
            })
        }
        let Class = parseInt(classSection);
        if(Class > 13 || Class <= 0){
            return res.status(200).render('signup', {
                error: "class must be between 1 to 12"
            })
        }
        let phoneNum = parseInt(phone);
        if (phone.length !== 10 || phone != phoneNum) {
            return res.status(200).render('signup', {
                error: "check the mobile number"
            })
        }

        let getEbooks = false;
        let referralCode = referral.toLowerCase().trim();
        if(referral !== ""){
            let ref = await refSch.findOne({referral : referralCode});
            if(ref){
                getEbooks = true;
            }
        }

        let user = await User.findOne({ phone });


        if (user && user.verified) {
            return res.status(200).render('signup', {
                error: "This phone number already exist"
            });
        }
        else if (user && !user.verified) {
            await User.findOneAndDelete({phone : user.phone});
        }
        user = await User.create({
            firstName,
            lastName,
            dob,
            phone,
            email,
            password,
            gender,
            schoolCode,
            classSection : Class,
            getEbooks,
            referral : referralCode
        })
        const otp = generateOTP();


        const otpSch = await OTP.findOne({ phone: phoneNum });
        if (otpSch) {
            await OTP.findOneAndDelete({ phone : otpSch.phone });
        }

        await OTP.create({
            otp,
            phone: phoneNum,
            password,
        })
        sendOTP(phoneNum,otp);

        const token = generateToken(user);
        return res.cookie("token", token,{ expires: new Date(Date.now() + (60*60*24*30*1000)) }).status(200).render('otp');
    }
    catch (err) {
        console.log("error ",err);
        return res.status(302).render('signup',{
            error : "something went wrong please try again later"
        });
    }
})

router.post('/login', async (req, res) => {
    const { phone, password } = req.body;
    try {
        const user = await User.findOne({ phone });
        if (!user || !user.verified) {
            return res.status(200).render('login', {
                error: "This user/phone does not exist"
            })
        }

        const salt = user.salt;
        const hashPasswordverify = createHmac('sha256', salt).update(password).digest('hex');

        if (hashPasswordverify !== user.password) {
            return res.status(200).render('login', {
                error: "Incorrect phone or password"
            })
        }

        const token = generateToken(user);

        const mcq = await MCQ.findOne({solvedBy : user._id})

        const mcqtoken = generateMcqToken(mcq);
        res.cookie("mcqtoken",mcqtoken,{ expires: new Date(Date.now() + (60*60*24*30*1000)) });
        return res.cookie("token", token,{ expires: new Date(Date.now() + (60*60*24*30*1000)) }).status(302).redirect('/');
    }
    catch (err) {
        return res.status(500).render('login', {
            error: "something went wrong try again after some time"
        })
    }
})


router.get('/logout', (req, res) => {
    res.clearCookie('mcqtoken');
    return res.clearCookie('token').status(302).redirect('/login');
})

router.get('/profile',updateCookie,(req, res) => {
    if(req.user && req.mcq){
        return res.status(200).render('profile',{
            mcq : req.mcq,
            user : req.user
        })
    }
    return res.status(302).redirect('/login');
})
router.get('/editprofile',updateCookie,(req, res) => {
    if(req.user && req.mcq){
        return res.status(200).render('editprofile',{
            user : req.user
        })
    }
    return res.status(302).redirect('/login');
})

router.post('/editprofile',async (req,res)=>{
    try {
        const { firstName, lastName, dob, classSection,gender } = req.body;
        if (firstName === "" || classSection === "" || dob === "") {
            return res.status(200).render('editprofile', {
                error: "fill all the required fields"
            })
        }

        if(gender !== "MALE" && gender !== "FEMALE" && gender !== "OTHER"){
            return res.status(200).render('editprofile',{
                error : "select your Gender correctly"
            })
        }

        let phone = req.user.phone;
        let phoneNum = parseInt(phone);
        let user = await User.findOne({phone : phoneNum});

        let currClass = parseInt(req.user.classSection);
        let updateClass = parseInt(classSection);

        if(updateClass > 13 || updateClass <= 0){
            return res.status(200).render('editprofile', {
                error: "class must be between 1 to 12"
            })
        }
        if(currClass !== updateClass){
            await MCQ.findOneAndUpdate({solvedBy : req.user._id},{
                $set : {
                    [`categories.MemoryEnhancement.qsnSolved`]: 0,
                    [`categories.AttentionAndFocus.qsnSolved`]: 0,
                    [`categories.Cognitive.qsnSolved`]: 0,
                    [`categories.MentalAgility.qsnSolved`]: 0,
                    [`categories.EmotionalIntelligence.qsnSolved`]: 0,
                    [`categories.MemoryEnhancement.correct`]: 0,
                    [`categories.AttentionAndFocus.correct`]: 0,
                    [`categories.Cognitive.correct`]: 0,
                    [`categories.MentalAgility.correct`]: 0,
                    [`categories.EmotionalIntelligence.correct`]: 0,
                    [`categories.MemoryEnhancement.inCorrect`]: 0,
                    [`categories.AttentionAndFocus.inCorrect`]: 0,
                    [`categories.Cognitive.inCorrect`]: 0,
                    [`categories.MentalAgility.inCorrect`]: 0,
                    [`categories.EmotionalIntelligence.inCorrect`]: 0
                }
            })
            let mcqSch = await MCQ.findOne({solvedBy : req.user._id});
            let mcqtoken = generateMcqToken(mcqSch);
            res.cookie('mcqtoken',mcqtoken,{ expires: new Date(Date.now() + (60*60*24*30*1000)) });
        }

        if (!user) {
            return res.status(200).render('editprofile', {
                error: "something went wrong please try again later"
            });
        }
        await User.findOneAndUpdate({phone : phoneNum},{$set : {firstName : firstName,classSection : classSection, lastName : lastName, dob : dob, gender : gender}});
        user = await User.findOne({phone : phoneNum});
        let token = generateToken(user);

        return res.cookie("token", token,{ expires: new Date(Date.now() + (60*60*24*30*1000)) }).status(302).redirect('/editprofile');
    }
    catch (err) {
        return res.status(302).redirect('/editprofile')
    }
})




module.exports = router;