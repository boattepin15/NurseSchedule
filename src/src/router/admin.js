const express = require('express')
const User = require('../model/User.js')
const CreateSchedule = require("../utils/CreateSchedule.js")
const { _, verifyToken } = require('../utils/token.js')
const authMiddleware = require('../middlewares/auth.js')
const Duty = require('../model/Duty.js')
const Group = require('../model/Group.js')
const ScheduleGroup = require('../model/ScheduleGroup.js')
const router = express.Router()


router.get('/TEST', (req, res) => {
    try {
        res.send({ message: "Hello World" })


    } catch (error) {
        res.send({ error: error })
    }
})
//ดึงสมาชิกในโรงพยาบาล
router.get("/member", authMiddleware, async (req, res) => {
    try{
        
        const token = req.query.token || req.headers['x-access-token']
        const pk = verifyToken(token)
        const uid = pk.user_id.sub
        
        const user = await User.findById(uid)
        const member = await User.find({location: user.location})
        if(member.length === 0) return res.send({message: "ไม่มีสมาชิก"})
        res.send({members : member})
        
    }catch(error){
        res.send({message:error})
    }
})

router.post("/addUser", authMiddleware, async(req, res) => {
    //ค้นหาตาม email
    //เพิ่มเข้า
    try{
        const token = req.query.token || req.headers['x-access-token']
        const pk = verifyToken(token)
        const uid = pk.user_id.sub
        const admin = await User.findById(uid)
        const member = await  User.findOne({email: req.body.email})
        if(!member) return res.send({message:"no foud"})
        member.location = admin.location
        await member.save()
        return res.send({message:"success"})
        
    }catch(error){
        res.send({message:error})
    }

})
router.get("/group", authMiddleware, async (req, res) => {
    
    try{
        const token = req.query.token || req.headers['x-access-token']
        const pk = verifyToken(token)
        const uid = pk.user_id.sub
        const admin = await User.findById(uid)
        const group = await Group.find({location: admin.location})
        .populate('_leader')
        .populate('_member')
        .exec(async function(error, data){
            if(data.length === 0 ) return res.send({message: "ไม่มีสมาชิกในกลุ่ม"})
            res.send({group: data})
        })

    }catch(error){
        res.send({message: error})
    }
})

router.patch("/updateUser/:UserId", async (req, res) => {

    const re = await User.findByIdAndUpdate({_id:req.params.UserId},{
        $set:req.body
    })

    if (!re) return res.send("update user incomplete")

    return res.send("update user success")
})

router.delete("/deleteUser/:userID", authMiddleware, async (req, res) => {
    const { userID } = req.params

   const re =  await User.findByIdAndDelete(userID)
 if (!re) return res.send("delete user incomplete")
    return res.send("delete user success")
})

module.exports = router