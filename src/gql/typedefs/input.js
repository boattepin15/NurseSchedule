module.exports = `
    input DeleteGroupInput {
        groupId: ID!
        approve: Boolean
    }

    input ApproveDeleteGroupInput {
        notificationId: ID!
        approve: Boolean
    }

    input UpdateGroupInput {
        _id: ID!
        location: String
        name_group: String
        auto_approve: Boolean
        limit: Int
    }

    input CreateLeaveInput {
        memberIds: [ID!]!
        dutyId: ID!
        shift: JSON
    }

    input ApproveLeaveMemberInput {
        notificationId: ID!
        approve: Boolean!
    }

    input ApproveLeaveLeaderInput {
        notificationId: ID!
        approve: Boolean!
    }

    input ChangeDutyInput {
        me: [ChangeDutyPayloadInput!]!
        withoutme: [ChangeDutyPayloadInput!]!
    }

    input ChangeDutyPayloadInput {
        id: ID!
        userID: ID!
        year: Int!
        month: Int!
        day: Int!
        group: ID!
        v: Int
        dutyString: String!
        dutyNumber: Int!
    }

    input ApproveSwitchMemberInput {
        notificationID: ID!
        approve: Boolean!
    }

    input ApproveSwitchLeaderInput {
        notificationID: ID!
        approve: Boolean!
    }
`