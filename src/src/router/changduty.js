const express = require('express')
const User = require('../model/User.js')
const CreateSchedule = require("../utils/CreateSchedule.js")
const { _, verifyToken } = require('../utils/token.js')
const authMiddleware = require('../middlewares/auth.js')
const Duty = require('../model/Duty.js')
const Group = require('../model/Group.js')
const ScheduleGroup = require('../model/ScheduleGroup.js')
const ChangDuty = require('../model/changDuty.js')
const { findById, find, populate, findOne, count, create } = require('../model/User.js')
const router = express.Router()
const date = new Date()
const runPy = require("../utils/runPy.js")
const fs = require('fs')
const { group } = require('console')
const { countShift } = require("../utils/shift")


router.get('/TEST', (req, res) => {
    res.send({
        message: "Hello World"
    })
    console.log(ChangDuty);
})





router.get('/leader/invited', authMiddleware, async (req, res) => {
    try {

        const token = req.query.token || req.headers['x-access-token']
        const pk = verifyToken(token)
        const uid = pk.user_id.sub

        
        //get data invited from nures
        const Dutys = await ChangDuty.find({_leader: uid}) 
        if(Dutys.length === 0 ) return res.send({message:"not found"})
        await ChangDuty.find({
            _leader: uid
        })
        .populate('_leader')
        .populate('member1')
        .populate('member2')
        .populate('_duty1')
        .populate('member_shift1')
        .populate('_duty2')
        .populate('member_shift2')
        .exec(async function (error, data) {
            res.send({ data: data })
        })
     

    } catch (error) {
        res.send({ message: error })
    }
})




/// ระบบอนุมัติคำร้องเเลกเวรจากพยาบาล
router.patch('/leader/inprove', authMiddleware, async (req, res) => {
    try {
        const token = req.query.token || req.headers['x-access-token']
        const pk = verifyToken(token)
        const uid = pk.user_id.sub

        // console.log(uid)

        const approve = req.body.approve
        const changId = req.body.changId
        

        const Dutys = await ChangDuty.findOne({
            $and: [
                {
                    _id: changId
                },

                {
                    show: false
                },
                {
                    member_approve: true
                },

                {
                    approve: false
                }
            ]
        })

        if (!Dutys) return res.send("duty is null")



        //เช็คเงื่อนไขว่า สมาชิกเเละหัวหน้าเป็นสมาชิกกลุ่มเดียวกันหรือไม่  

        const group = await Group.findOne({
            $and: [{
                _leader: {
                    $elemMatch: {
                        $eq: uid
                    }
                }
            },
            {
                _member: {
                    $in: [Dutys.member1, Dutys.member2]
                }
            }]
        }
        )

        if (!group) {
            return res.send("group not found")
        }

        if (!approve) {
            Dutys.show = false
            Dutys.approve = false
            await Dutys.save()
            return res.send("no approve")
        }

        const duty_1 = Dutys._duty1
        const duty_2 = Dutys._duty2

        const [memberDuty1, memberDuty2] = await Promise.all([Duty.findById(duty_1), Duty.findById(duty_2)])
        

        const shift_1 = Dutys.member_shift1[0]
        const shift_2 = Dutys.member_shift2[0]
      

        Object.keys(shift_2).forEach( key => {
            memberDuty1[key] = 1
            memberDuty2[key] = 0
        })

        Object.keys(shift_1).forEach( key => {
            memberDuty1[key] = 0
            memberDuty2[key] = 1
        })
         
       

        memberDuty1.count = countShift(memberDuty1)
        memberDuty2.count = countShift(memberDuty2)

        console.log({
            shift_1,
            shift_2,
            memberDuty1,
            memberDuty2
        })
      
        await Promise.all([memberDuty1.save(), memberDuty2.save()])


        return res.send(group)

    } catch (error) {
        res.send({ message: error })
    }
})


router.patch('/inproive', authMiddleware, async (req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub
    const apporve = req.body.apporve
    const chagnId = req.body.chagnId
    try {

        if (apporve === false) {
            const chang = await ChangDuty.findOneAndUpdate({ _id: chagnId }
                , {
                    member_approve: false,
                    show:false
                })

            return res.send({ message: "success" })

        } else {

            await ChangDuty.updateOne({
                _id: chagnId
            }, {
                member_approve:true,
                show: false
            })

            return res.send({ message: "success" })

        }


    } catch (error) {
        res.send({ message: error })
    }
})

router.get('/invite', authMiddleware, async (req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub

    try {
        await ChangDuty.find({
            $or: [
                {
                    member1: uid
                },
                {
                    member2: uid
                }
            ],
            $and: [
                {
                    show: true
                }
            ]
        })
            .populate('member1')
            .populate('member2')
            .populate('_duty1')
            .populate('member_shift1')
            .populate('_duty2')
            .populate('member_shift2')
            .exec(async function (error, data) {
                if (data.length !== 0) {
                    res.send({ data: data })

                } else {
                    res.send({ messaeg: "don't have req" })
                }
            })
    } catch (error) {
        res.send({ message: error })
    }
})



router.post('/invite', authMiddleware, async (req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub
    const data = req.body.data
    dutes1 = []
    

    try {

        const member1 = data[0]
        const member2 = data[1]
        const group = await Group.findOne({name_group: member1.group})

        await ChangDuty.create({
            _leader: group._leader[0],
            _group1: member1.group,
            _group2: member2.group,
            member1: member1._user,
            member2: member2._user,
            _duty1: member1._id,
            member_shift1: member1.shift,
            _duty2: member2._id,
            member_shift2: member2.shift
        }).then(async function (data) {
            res.send({ message: "success" })
        })

    } catch (error) {
        res.send({ message: error })
    }
})




module.exports = router
