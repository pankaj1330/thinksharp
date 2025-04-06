const {Schema,model} = require('mongoose');

const mcqSch = new Schema({
    solvedBy : {
        type : Schema.Types.ObjectId,
        required :true
    },
    qsnSolved : {
        type : Number,
        required :true,
        default : 0
    },
    correct : {
        type:Number,
        required:true,
        default : 0
    },
    inCorrect : {
        type : Number,
        required : true,
        default : 0
    },
    flashcards : {
        type : Number,
        default : 1,
    },
    quotes : {
        type : Number,
        default : 1,
    },
    categories : {
        "MemoryEnhancement" : {
            qsnSolved : {
                type:Number,
                required : true,
                default:0
            },
            correct : {
                type:Number,
                required : true,
                default:0
            },
            inCorrect : {
                type:Number,
                required : true,
                default:0
            },
            levelEachDay : {
                type : Number,
                required : true,
                default : 2,
            }
        },
        "AttentionAndFocus" : {
            qsnSolved : {
                type:Number,
                required : true,
                default:0
            },
            correct : {
                type:Number,
                required : true,
                default:0
            },
            inCorrect : {
                type:Number,
                required : true,
                default:0
            },
            levelEachDay : {
                type : Number,
                required : true,
                default : 2,
            }
        },
        "Cognitive" : {
            qsnSolved : {
                type:Number,
                required : true,
                default:0
            },
            correct : {
                type:Number,
                required : true,
                default:0
            },
            inCorrect : {
                type:Number,
                required : true,
                default:0
            },
            levelEachDay : {
                type : Number,
                required : true,
                default : 2,
            }
        },
        "MentalAgility" : {
            qsnSolved : {
                type:Number,
                required : true,
                default:0
            },
            correct : {
                type:Number,
                required : true,
                default:0
            },
            inCorrect : {
                type:Number,
                required : true,
                default:0
            },
            levelEachDay : {
                type : Number,
                required : true,
                default : 2,
            }
        },
        "EmotionalIntelligence" : {
            qsnSolved : {
                type:Number,
                required : true,
                default:0
            },
            correct : {
                type:Number,
                required : true,
                default:0
            },
            inCorrect : {
                type:Number,
                required : true,
                default:0
            },
            levelEachDay : {
                type : Number,
                required : true,
                default : 2,
            }
        },
    }
},
{timestamps:true})
;

const MCQ = model('MCQ',mcqSch);

module.exports = MCQ;