const mongoose = require('mongoose')
const User = require('./User.js')
const Duty = require('./Duty.js')
const Group = require('./Group.js')

const Invite = new mongoose.Schema({

   _leader:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   },
   _group:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Group"
   },
   _member:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   },
   show:{
      type:Boolean,
      default:true
   },
   apporve:{
    type:Boolean,
    default:false
   }

})

module.exports = mongoose.model('Invite', Invite)