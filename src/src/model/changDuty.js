const mongoose = require('mongoose')


const ChangDuty = new mongoose.Schema({
    _leader:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    _group1:{
        type: String,
        ref:"Group"
    },
    _group2:{
        type: String,
        ref:"Group"
    },
    member1:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    member2:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    _duty1:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Duty"
    },
    member_shift1:[{
        type: Object
    }],
    _duty2:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Duty"
    },
    member_shift2:[{
        type: Object
    }],
    member_approve:{
        type:Boolean
    },
    show:{
        type:Boolean,
        default:true
    },
    approve:{
        type:Boolean,
        default:false
    }
    
})

module.exports = mongoose.model('ChangDuty', ChangDuty)