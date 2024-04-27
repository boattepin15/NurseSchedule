const mongoose = require('mongoose')
const User = require('./User.js')
const Duty = require('./Duty.js')

const Group = new mongoose.Schema({
    location: { type: String },
    name_group: { type: String },
    limit:{
        type:Number,
        default:1
    },
    _leader: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    _member: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    auto_approve: {
        type: Boolean
    },
    deleted: {
        type: Boolean,
        default: false
    }
})


module.exports = mongoose.model('Group', Group)