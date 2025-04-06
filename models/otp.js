const {Schema,model} = require('mongoose');

const OTPsch = new Schema({
    otp : {
        type : Number,
        required : true
    },
    phone : {
        type:Number,
        required:true,
        unique:true
    },
    password : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now,
        expires : 120
    }
},
{timestamps:true})
;

const OTP = model('OTP',OTPsch);

module.exports = OTP;