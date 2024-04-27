const Query = require("./Query")
const Mutation = require("./Mutation")
const type = require("./type")
const input = require("./input")

module.exports = `
    scalar Date
    scalar JSON 

    ${Query}
    ${Mutation}
    ${type}
    ${input}
`