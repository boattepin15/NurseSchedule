const mongoose = require('mongoose')
const User = require('./User.js')
const Duty = require('./Duty.js')
const Schedule = new mongoose.Schema({
   _user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   },
   _duty:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Duty"
      }
   ],
   year:{
    type:String
   },
   createAt:{
    type:Date
   }
})

module.exports = mongoose.model('Schedule', Schedule)