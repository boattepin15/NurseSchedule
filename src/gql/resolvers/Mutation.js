const User = require("../../model/User")
const Group = require("../../model/Group")
const Notification = require("../../model/Notification")
const Duty = require("../../model/Duty")
const { countShift } = require("../../utils/shift")
const requiredAuth = require("../../utils/requireAuth")

module.exports = {
    deleteGroup: async (_, { input }, ctx) => {
        const decoded = requiredAuth(ctx)
        const user = await User.findById(decoded.user_id.sub)
        const group = await Group.findById(input.groupId)

        const noti = {
            type: "DELETE_GROUP",
            _user: "63517d1c270eff076b75e92f",
            fields: {
                group
            }
        }

        await Notification.create(noti)
        return "OK"
    },

    approveDeleteGroup: async (_, { input }, ctx) => {
        const decoded = requiredAuth(ctx)
        const noti = await Notification.findById(input.notificationId)


        const groupId = noti.fields.group._id
        const group = await Group.updateOne({ _id: groupId }, { deleted: true })
        const update_new = await Notification.updateOne({ _id: input.notificationId }, { $set: { approve_by: decoded.user_id.sub, noift: '2' } })

        return "OK"

    },

    updateGroup: async (_, { input }) => {
        const { _id, ...body } = input
        const group = await Group.findById(_id)

        if (input.limit !== undefined && group._member.length > input.limit) {
            throw new Error("member less limit")
        }
        await Group.updateOne({ _id }, { $set: body })

        return await Group.findById(_id)
    },
    createLeave: async (_, { input }, context) => {
        const decoded = requiredAuth(context)
        const { memberIds, dutyId, shift } = input
        const duty = await Duty.findById(dutyId)
        const group = await Group.findOne(duty.name_group)
        const user = await User.findById(decoded.user_id.sub)
        const response = await Promise.all(memberIds.map(id => Notification.create({
            type: "LEAVE_DUTY",
            _user: id,
            fields: {
                createdBy: user,
                duty: duty,
                shift: shift,
                approve: false,
                leader: group._leader[0].toString()
            },
            noti: '2'
        })))

        return response
    },

    approveLeaveMember: async (_, { input }, context) => {
        const decoded = requiredAuth(context)

        const { notificationId, approve } = input
        const noti = await Notification.findById(notificationId).lean()

        const data = { ...noti }
        data.fields.approve = approve
        data.noift = '2'
        data._user = data.fields.leader
        data.approve_by = decoded.user_id.sub
        const response = await Notification.updateOne({ _id: notificationId }, { $set: data })
        return response

    },

    approveLeaveLeader: async (_, { input }, context) => {
        const decoded = requiredAuth(context)

        const { notificationId, approve } = input
        const noti = await Notification.findById(notificationId).lean()
        const data = { ...noti }
        //const { dutyId, shift, createdBy } = data.fields

        await Notification.updateOne({ _id: notificationId }, { noift: "3" })
        // คนที่ขอลา
        const duty = await Duty.findById(data.fields.duty._id).lean()
        const oldDuty = JSON.parse(JSON.stringify(duty))
        const group = await Group.findOne({ name_group: noti.fields.duty.group })
        Object.keys(data.fields.shift).forEach(key => {
            duty[key] = 0
        })

        duty.count = countShift(duty)
        await Duty.updateOne({ _id: duty._id }, { $set: duty })
        // await duty.save()

        await Notification.create({
            type: "CHANGE_DUTY",
            _user: data.fields.createdBy,
            approve_by: decoded.user_id.sub,
            fields: {
                prev: oldDuty,
                duty: duty,
                group: group
            }
        })

        const dutyF = await Duty.findOne({
            _user: noti.approve_by._id,
            year: noti.fields.duty.year,
            month: noti.fields.duty.month,
            day: noti.fields.duty.day
        }).lean()

        const oldDutyF = JSON.parse(JSON.stringify(dutyF))
        Object.keys(data.fields.shift).forEach(key => {
            dutyF[key] = 1
        })

        dutyF.count = countShift(dutyF)
        await Duty.updateOne({ _id: dutyF._id }, { $set: dutyF })
        await Notification.create({
            type: "CHANGE_DUTY",
            _user: noti.approve_by._id,
            approve_by: decoded.user_id.sub,
            fields: {
                prev: oldDutyF,
                duty: dutyF,
                group: group
            }
        })

        return "OK"
    },
    changeDuty: async (_, { input }) => {
        const { me, withoutme } = input
        if (me.length !== withoutme.length) {
            throw new Error("length not match")
        }

        const noti = await Promise.all(me.map(async (e, index) => {
            const friend = withoutme[index]
            const user = await User.findById(e.userID)
            return {
                type: "SWITCH_DUTY",
                _user: friend.userID,
                fields: {
                    me: friend,
                    withoutme: e,
                    user
                },

            }
        }))

        console.log(JSON.stringify(noti, null, 2))
        const res = await Promise.all(noti.map(e => Notification.create(e)))
        return res
    },
    approveSwitchMember: async (_, { input }, context) => {
        const decoded = requiredAuth(context)

        const noti = await Notification.findById(input.notificationID)

        if (!noti) {
            throw new Error("Notification not found")
        }

        const group = await Group.findOne({
            name: noti.fields.me.group
        })

        if (!group) {
            throw new Error("Group not found")
        }

        await Notification.updateOne({ _id: noti._id }, {
            $set: {
                _user: group._leader[0],
                approve_by: decoded.user_id.sub,
                fields: {
                    ...noti.fields,
                    approve: input.approve
                },
                noift: "2"
            }
        })

        return await Notification.findById(input.notificationID)
    },
    approveSwitchLeader: async (_, { input }, context) => {
        const decoded = requiredAuth(context)

        const noti = await Notification.findById(input.notificationID)
        if (!noti) {
            throw new Error("Notification not found")
        }

        await Notification.updateOne({ _id: noti._id }, {
            $set: {
                noift: "3"
            }
        })

        /*
         {
                type: "CHANGE_DUTY",
                _user: item._user,
                approve_by: approveBy,
                fields: {
                    prev: item.prev,
                    duty: item.duty,
                    group: schedules[0]._group
                }
            }
         */



        const withoutMeDuty = await Duty.findById(noti.fields.withoutme.id).lean()
        const meDuty = await Duty.findById(noti.fields.me.id).lean()

        const _withoutMeDuty = JSON.parse(JSON.stringify(withoutMeDuty))
        const _meDuty = JSON.parse(JSON.stringify(meDuty))


        _meDuty[noti.fields.withoutme.dutyString] = noti.fields.withoutme.dutyNumber
        _meDuty[noti.fields.me.dutyString] = 0
        _meDuty.count = countShift(_meDuty)

        _withoutMeDuty[noti.fields.me.dutyString] = noti.fields.me.dutyNumber
        _withoutMeDuty[noti.fields.withoutme.dutyString] = 0
        _withoutMeDuty.count = countShift(withoutMeDuty)

        await Duty.updateOne({ _id: _meDuty._id }, { $set: _meDuty })
        await Duty.updateOne({ _id: _withoutMeDuty._id }, { $set: _withoutMeDuty })

        const group = await Group.findOne({ name: noti.fields.me.group })

        // console.log(duty)

        await Notification.create({
            type: "CHANGE_DUTY",
            _user: noti.fields.withoutme.userID,
            fields: {
                prev: withoutMeDuty,
                duty: _withoutMeDuty,
                group
            }
        })

        await Notification.create({
            type: "CHANGE_DUTY",
            _user: noti.fields.me.userID,
            fields: {
                prev: meDuty,
                duty: _meDuty,
                group
            }
        })

        return { meDuty: _meDuty, withoutMeDuty: _withoutMeDuty }
    }
}