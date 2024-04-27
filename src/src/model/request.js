const mongoose = require('mongoose')
const User = require('./User.js')
const Duty = require('./Duty.js')

const Request = new mongoose.Schema( {
    location: {
        type: String
    },
    _user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    },
    type:{
        type:String
    },
    detail:{
        type: String
    },
    _duty:{
        type: mongoose.Schema.Types.ObjectId,
        ref:Duty

    },
    shift:{
        type: Object
    },
    show:{
        type: Boolean,
        default: true

    },
    approve:{
        type: Boolean,
        default: false
    }
} )

module.exports = mongoose.model('Request', Request)