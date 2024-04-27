const User = require("../model/User")
const Group = require("../model/Group")
const Notification = require("../model/Notification")
const jwt = require("jsonwebtoken")
const Duty = require("../model/Duty")
const date = new Date()
const { countShift } = require("../utils/shift")
function requiredAuth({ authorization }) {
    return jwt.verify(authorization, process.env.JWT_SECRET)
}

module.exports = {
    Query: {
        bark: () => "BARK",
        users: async () => await User.find(),
        user: async (root, { _id }) => await User.findById(_id),
        notifications: async (root, { filter }, { decoded }) => {

            console.log(filter)

            const noti = await Notification.find({
                _user: decoded.user_id.sub
            }).where(filter)

            return noti
        }
    },
    Mutation: {

        deleteGroup: async (_, { input }, ctx) => {
            const decoded = requiredAuth(ctx)
            const user = await User.findById(decoded.user_id.sub)
            const group = await Group.findById(input.groupId)
            
            const noti = {
                type: "DELETE_GROUP",
                _user: "63281616042a723f63a3be27",
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
            const group = await Group.updateOne({ _id: groupId },  { deleted: true  })
            const update_new = await Notification.updateOne({ _id: input.notificationId }, { $set: { approve_by: decoded.user_id.sub , noift:'2'} })
            
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
                noti:'2'
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
            
            await Notification.updateOne({_id:notificationId}, {noift:"3"})
            // คนที่ขอลา
            const duty = await Duty.findById(data.fields.duty._id)
            const oldDuty = JSON.parse(JSON.stringify(duty))
            const group = await Group.findOne({name_group:  noti.fields.duty.group})
            Object.keys(data.fields.shift).forEach(key => {
                duty[key] = 0
            })
            duty.count = countShift(duty)
            await duty.save()
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
                month:noti.fields.duty.month,
                day: noti.fields.duty.day
            })
            const oldDutyF = JSON.parse(JSON.stringify(dutyF))
            Object.keys(data.fields.shift).forEach(key => {
                dutyF[key] = 1
            })
            dutyF.count = countShift(dutyF)
            await dutyF.save()
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
        }
    },
    User: {
        groups: async (root) => {
            const groups = await Group.find({
                _member: {
                    $in: [root._id]
                }
            })

            return groups
        }
    },
    Group: {
        leader: async (root) => await User.findById(root._leader),
        members: async (root) => {
            return await Promise.all(root._member.map(m => User.findById(m)))
        }
    },
    Notification: {
        approve_by: async (root) => await User.findById(root.approve_by),
        user: async (root) => await User.findById(root._user),
    },


}