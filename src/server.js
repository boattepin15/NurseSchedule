const express = require('express')
const cors = require('cors')
const { ApolloServer, gql } = require('apollo-server-express');

const auth = require('./router/auth.js')
const user = require('./router/user.js')
const schedule = require('./router/Schedule.js')
const group = require('./router/group.js')
const invite = require('./router/invite.js')
const ChangDuty = require('./router/changduty.js')
const admin = require('./router/admin.js')
const Request = require('./router/request.js')

const typeDefs = require("./gql/typeDefs")
const resolvers = require("./gql/resolvers");
const jwt = require("jsonwebtoken")

const app = express()

app.use(cors('*'))
app.use(express.json())

app.use("/api/auth", auth)
app.use("/api/me/", user)
app.use("/api/schedule", schedule)
app.use('/api/group', group)
app.use('/api/invite', invite)
app.use('/api/changduty', ChangDuty)
app.use('/api/admin', admin)
app.use('/api/req', Request)


const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const authorization = req.headers.authorization || ''
        const decoded =  authorization && jwt.verify(authorization, process.env.JWT_SECRET)
        
        return { authorization, decoded }
    }
})


module.exports = { app, apollo }

