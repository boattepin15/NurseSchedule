module.exports = `
    scalar Date
    scalar JSON

    type Query {
        bark: String
        users: [User]
        user(_id: ID!): User
        notifications(filter: JSON): [Notification] 
    }

    type Mutation {
        deleteGroup(input: DeleteGroupInput!): String
        approveDeleteGroup(input: ApproveDeleteGroupInput!): String
        updateGroup(input: UpdateGroupInput!): Group
        createLeave(input: CreateLeaveInput!): JSON
        approveLeaveMember(input: ApproveLeaveMemberInput!): JSON
        approveLeaveLeader(input: ApproveLeaveLeaderInput!): JSON
    }

    type User {
        _id: ID
        frist_name: String
        last_name: String
        email: String
        actor: String
        localtion: String
        tokenVersion: Int
        createdAt: Date

        ### nested
        groups: [Group]
    }

    type Group {
        _id: ID
        location: String
        name_group: String
        _leader: String
        _member: [String]
        auto_approve: Boolean
        limit: Int

        ### nested
        leader: User
        members: [User]
    }

    type Notification {
        _id: ID
        type: String
        fields: JSON
        approve_by: User
        createdAt: Date
        noift: String

        ### nested
        user: User
    }

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
   
`