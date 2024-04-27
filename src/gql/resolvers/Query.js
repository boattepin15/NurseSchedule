const User = require("../../model/User")
const Notification = require("../../model/Notification")

module.exports = {
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
}