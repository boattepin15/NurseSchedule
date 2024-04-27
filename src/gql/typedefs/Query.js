module.exports = `
    type Query {
        bark: String
        users: [User]
        user(_id: ID!): User
        notifications(filter: JSON): [Notification] 
    }

`