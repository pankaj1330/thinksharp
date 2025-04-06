const {Schema,model} = require('mongoose');

const referralSch = new Schema({
    fullName : {
        type: String,
        required : true
    },
    phone : {
        type:Number,
        required:true,
        unique:true
    },
    referral : {
        type : String,
        unique : true,
        required : true
    }
},
{timestamps:true})
;

const refSch = model('refSch',referralSch);

module.exports = refSch;