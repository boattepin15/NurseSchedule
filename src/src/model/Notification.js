const mongoose = require('mongoose')

const Notification = new mongoose.Schema( {
    type: {
        type: String // "CHANGE_DUTY" | "REQUEST_DUTY" | "DELETE_GROUP" | "LEAVE_DUTY"
    },
    approve_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    fields: {
        type: Object,
    },
    noift:{
        type: String,
        default: "1"
    },
    createdAt:{
        type:Date,
        default: () => new Date()
    }
} )

module.exports = mongoose.model('Notification', Notification)

