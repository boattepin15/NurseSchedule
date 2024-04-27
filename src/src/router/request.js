const express = require('express')
const User = require('../model/User.js')
const CreateSchedule = require("../utils/CreateSchedule.js")
const { _, verifyToken } = require('../utils/token.js')
const authMiddleware = require('../middlewares/auth.js')
const Duty = require('../model/Duty.js')
const Group = require('../model/Group.js')
const ScheduleGroup = require('../model/ScheduleGroup.js')
const Request = require('../model/request.js')
const { countShift } = require("../utils/shift")


const { findById, find, populate, findOne, count } = require('../model/User.js')
const router = express.Router()
const date = new Date()



router.get('/TEST', (req, res) =>{
    try{
        res.send({
            message: 'TEST'
        })

    }catch(error){
        res.send({
            message: error
        })
    }
})

router.post('/take/leave',authMiddleware, async (req, res) => {
    try{

        const token = req.query.token || req.headers['x-access-token']
        const pk = verifyToken(token)
        const uid = pk.user_id.sub
        data = {
            _user: uid,
            type: req.body.type,
            detail: req.body.detail,
            _duty: req.body._duty,
            shift: req.body.shift
        }
        const user = await User.findById(uid)
        await Request.create({
            location: user.location,
            _user: data._user,
            type: data.type,
            detail: req.body.detail,
            _duty: data._duty,
            shift: data.shift
        })

        res.send({message: 'success'})
    }catch(error){
        res.send({
            message: 'error'
        })
    }
})

router.get('/take/leave', authMiddleware, async (req, res) => {
    try{
        const token = req.query.token || req.headers['x-access-token']
        const pk = verifyToken(token)
        const uid = pk.user_id.sub

        const jobs = await Request.find({
            _user:uid,
            show: true,
            approve: false
        })
        if(jobs.length === 0) return res.send({
            message:'not take leave'
        })
        res.send({data: jobs})

    }catch(error){
        res.send({message: "Error"})
    }
})
router.get('/leader/take/leave', authMiddleware, async (req, res) =>{
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub

    try{
        const user = await User.findById(uid)
        await Request.find({location: user.location})
        .populate('_user')
        .exec(async function(error, data){
            res.send({data: data})
        })

    }catch(error){
        res.send({
            message: 'error'
        })
    }
})

router.patch('/leader/take/leave/approve', async (req, res)=> {
    try{    

        const requestID = req.body.requestID
        const approve = req.body.approve
 
        if(approve === true){
            const request = await Request.findById(requestID)
            if(!request) return res.send({message :"ไม่พบข้อมูล request"})
            const dutyID = request._duty
            const duty = await Duty.findById(dutyID)
            console.log(1, duty);
            Object.keys(request.shift).forEach(element => {
                duty[element] = 0
            });
            duty.count = countShift(duty)
            console.log(2, duty);
            request.show = false
            request.approve = true
            
            await Promise.all([duty.save(), request.save()])
            res.send({
                message: 'success'
            })  
        
        }else{
            const request = await Request.findById(requestID)
            request.show = false
            request.approve = false
            await Promise.all(request.save())
            res.send({
                message:"message"
            })
        
        }

    }catch(error){
        res.send({
            message :'error'
        })
    }
})


module.exports = router
