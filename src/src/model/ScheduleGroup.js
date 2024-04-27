const mongoose = require('mongoose')
const User = require('./User')
const Duty = require('./Duty')
const Group = require('./Group')
const { create } = require('./User')


const ScheduleGroup = new mongoose.Schema({
    _group:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group'
    },
    
    _user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    _duty:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Duty'
    }]
})

module.exports = mongoose.model('ScheduleGroup', ScheduleGroup)
