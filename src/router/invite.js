const express = require('express')
const User = require('../model/User.js')
const CreateSchedule = require("../utils/CreateSchedule.js")
const { _, verifyToken } = require('../utils/token.js')
const authMiddleware = require('../middlewares/auth.js')
const Duty = require('../model/Duty.js')
const Group = require('../model/Group.js')
const ScheduleGroup = require('../model/ScheduleGroup.js')
const Invite = require('../model/invite.js')
const { findById } = require('../model/User.js')
const router = express.Router()
const date = new Date()
const runPy = require("../utils/runPy.js")



router.get('/TEST', (req, res) => {
    res.send({ message: "PASS" })
})


router.put('/apporve', authMiddleware, async (req, res) => {
    //หัวหน้าส่ง true
    //เปลี่ยนสถาณะ
    //เพิ่มสมาชิกเข้ากลุ่ม
    //สร้างตารางเวรต่อกับกลุ่ม
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub
    const duties = []


    try {

        const id = req.body.id
        const groupId = req.body.groupId
        const userId = req.body.userId
        const apporve = req.body.apporve
        const group = await Group.findById(groupId)
        const user = await User.findById(userId)

        if (!groupId) return res.send({
            message: "ไม่พบ groupId"
        })
        if (!user) return res.send({ message: "ไม่พบ userId" })

        if (apporve === false) {
            console.log(group._id, user._id, apporve);


            await Invite.findOneAndUpdate({ _id: id, _group: group._id, _member: user._id },
                {
                    show: false
                })
            return res.send({ message: "success" })

        }
        if (apporve === true) {
            console.log("TEST");
            const invite = await Invite.findOneAndUpdate({ _id: id, _group: group._id, _member: user._id },
                {
                    show: false,
                    apporve: true
                })

            await Group.findByIdAndUpdate({
                _id: group._id
            },
                {
                    $push: {
                        _member: user._id
                    }
                })
                .then(async () => {
                    await ScheduleGroup.create({
                        _group: group._id,
                        _user: user._id,
                    })

                    const duty = await Duty.find({
                        _user: user._id,
                        year: date.getFullYear(),
                        month: date.getMonth() + 1
                    })

                    await duty.forEach(async element => {
                        duties.push(element._id)
                    })

                    await ScheduleGroup.updateOne({
                        $and: [
                            {
                                _group: group._id
                            },
                            {
                                _user: user._id
                            }
                        ]
                    }, { $push: { _duty: duties } })


                })

            return res.send({ message: "success" })

        }


    } catch (error) {
        res.send(error)
    }

})



router.get('/invite', authMiddleware, async (req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const uid = pk.user_id.sub

    try {

        const invite = await Invite.find({ _member: uid, show: true })
            .populate('_leader')
            .populate('_group')
            .populate('_member')
            .exec(function (error, data) {
                res.send({ invite: data })
            })

    } catch (error) {
        res.send(error)
    }

})

router.post('/invite', authMiddleware, async (req, res) => {
    const token = req.query.token || req.headers['x-access-token']
    const pk = verifyToken(token)
    const leader_id = pk.user_id.sub



    try {
        if (!req.body.email) return res.send({ message: "ไม่ได้กำหนด email" })
        if (!req.body.name_group) return res.send({ message: "ไม่ได้กำหนด name_group" })
       
        const leader = await User.findById(leader_id)
        const user = await User.findOne({ email: req.body.email, location: leader.location })
       
        const now = new Date()
        const duty = await Duty.find({ $and: [{ _user: user._id }, { month: now.getUTCMonth() + 1 }, { year: now.getUTCFullYear() }] })

        for (const element of duty) {
            if (element.count !== 0) return res.send({ message: "ผู้ใช้งานนี้มีการจัดตารางขึ้นเวรแล้ว" })
        }
        

        const group = await Group.findOne({ name_group: req.body.name_group, location: leader.location })
        // ค้นว่าพบข้อมูล กลุ่มหรือไม่
        if (!group) return res.send({ message: "ไม่พบข้อมูล" })
        if (!user) return res.send({ message: "ไม่สามารถเพิ่มสมาชิกได้" })
        const findGroup = await Group.findOne({ _id: group._id, _member: user._id })
        if (findGroup) {
            res.send({ message: "ผู้ใช้งานนี้อยู่ในหวอดอยู่เเล้ว" })

        } else {
            await Invite.create({
                _leader: leader._id,
                _group: group._id,
                _member: user._id
            })
                .then(function (data) {
                    res.send(data)
                })

        }
    }
    catch (error) {
        res.send(error)
    }
})



module.exports = router

