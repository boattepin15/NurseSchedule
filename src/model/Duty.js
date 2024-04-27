const mongoose = require('mongoose')


const Duty = new mongoose.Schema({
    _user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    year:{
        type:String
    },
    month:{
        type:String
    },
    day:{
        type:String
    },
    group:{
        type:String
    },
    morning:{
        type:Number
    },
    noon:{
        type:Number
    },
    night:{
        type:Number
    },
    count:{
        type:Number
    }

})

module.exports = mongoose.model('Duty', Duty)