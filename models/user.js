const {Schema,model} = require('mongoose');
const {createHmac,randomBytes} = require('crypto');
const MCQ = require('../models/mcq');

const Usersch = new Schema({
    firstName : {
        type : String,
        required :true
    },
    lastName : {
        type : String
    },
    dob : {
        type : Date,
        required : true
    },
    phone : {
        type:Number,
        required:true,
        unique:true
    },
    email : {
        type:String
    },
    salt : {
        type : String
    },
    password : {
        type:String,
        required:true
    },
    schoolCode : {
        type : String
    },
    classSection : {
        type : String,
        required:true
    },
    referral : {
        type : String,
        default : ""
    },
    subscribed : {
        type : Boolean,
        default : false
    },
    gender : {
        type : String,
        enum : ['MALE','FEMALE','OTHER'],
        required : true
    },
    verified : {
        type : Boolean,
        default : false
    },
    getEbooks : {
        type : Boolean,
        default : false
    },
    subscribedDate : {
        type : Date,
    },
    endDate : {
        type : Date,
    },
    role : {
        type : String,
        enum : ['USER','ADMIN'],
        default : "USER"
    }
},
{timestamps:true})
;

Usersch.pre('save',function(next){
    const user = this;
    if(!user.isModified('password')) return;
    const salt = randomBytes(16).toString();
    const hashPassword = createHmac('sha256',salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashPassword;

    MCQ.create({
        solvedBy : user._id,
    })

    return next();
})


const User = model('User',Usersch);

module.exports = User;