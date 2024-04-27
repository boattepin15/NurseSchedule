const User = require("../../model/User")
const Group = require("../../model/Group")

module.exports = {
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