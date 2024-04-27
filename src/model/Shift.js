const mongoose = require('mongoose')
const Duty = require('./Duty')


const Shift = new mongoose.Schema({
    _duty:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Duty"
    }],
    _user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
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

module.exports = mongoose.model('Shift', Shift)