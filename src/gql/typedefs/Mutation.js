module.exports = `
    type Mutation {
        deleteGroup(input: DeleteGroupInput!): String
        approveDeleteGroup(input: ApproveDeleteGroupInput!): String
        updateGroup(input: UpdateGroupInput!): Group
        createLeave(input: CreateLeaveInput!): JSON
        approveLeaveMember(input: ApproveLeaveMemberInput!): JSON
        approveLeaveLeader(input: ApproveLeaveLeaderInput!): JSON
        # comment
        changeDuty(input: ChangeDutyInput!): JSON
        approveSwitchMember(input: ApproveSwitchMemberInput!): JSON
        approveSwitchLeader(input: ApproveSwitchLeaderInput!): JSON
    }
`