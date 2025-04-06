require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const User = require('./models/user');
const MCQ = require('./models/mcq');
const { generateToken} = require('./services/auth');

const staticRoutes = require('./routes/staticRoute');
const userRoutes = require('./routes/userRoute');
const mcqRoutes = require('./routes/mcqRoute');
const gamesRoutes = require('./routes/gamesRoute')
const referralRoute = require('./routes/referral')
const { authenticateUser, isPaid, isLoggedIn,updateCookie } = require('./middleware/auth');
const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("mongodb connected"); })
    .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(express.static(path.resolve('./public')));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authenticateUser());

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

cron.schedule('0 0 * * *', async () => {
    //update flashcard every mid night
    try {
        let users = await User.find({});
        users.map(async(user) => {
            if(user.subscribed){
                await MCQ.findOneAndUpdate({solvedBy : user._id}, {
                    $inc: {
                        flashcards: 2
                    }
                })
            }
        })
    } catch (error) {
        console.error('Error updating count:', error);
    }
    return;
});

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});
app.post('/create-order',async (req, res) => {
    var options = {
        amount: 99900,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
    };
    instance.orders.create(options, function (err, order) {
        if(err){
            return res.status(500).send({message : "something went wrong"});
        }
        return res.status(200).send({ orderId: order.id })
    });
})

app.post('/verifypayment', async (req, res) => {
    if(!req.user){
        return res.status(401).send({message:"payment failed"});
    }
        try{
            await User.findByIdAndUpdate(req.user._id,{
                $set : {
                    subscribed : true,
                    subscribedDate : Date.now(),
                    endDate : new Date(Date.now() + (60*60*24*366*1000))
                }
            })
            let user = await User.findById(req.user._id);
            const usertoken = generateToken(user);
            res.cookie("token",usertoken,{ expires : new Date(Date.now() + (60*60*24*30*1000))});
            return res.status(200).send({message : "payment successfull"})
        }
        catch(err){
            console.log("err ", err);
            return res.status(500).send({message : "something went wrong"});
        }
})

app.get('/',updateCookie, async (req, res) => {
    if (req.user && req.mcq) {
        return res.status(200).render('home', {
            user: req.user
        });
    }
    return res.status(200).render('home');
})
app.get('/pay',isLoggedIn, async (req, res) => {
    if (req.user && req.mcq){
        return res.status(200).send("sorry, this page currently unavailable");
    }
    return res.status(302).redirect('/login');
})


app.use('/', staticRoutes);
app.use('/', userRoutes);
app.use('/', referralRoute);
app.use('/', isPaid, mcqRoutes);
app.use('/games', isPaid, gamesRoutes);
app.get('/medispot',isPaid,(req,res)=>{
    return res.status(200).render('medispot');
})

app.get('*', (req, res) => {
    return res.status(400).render('err');
})


app.listen(PORT, () => {
    console.log(`listening at port ${PORT}`);
})