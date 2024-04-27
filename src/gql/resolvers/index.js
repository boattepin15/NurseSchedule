const Query = require("./Query")
const type = require("./type")
const Mutation = require("./Mutation")



module.exports = {
    Query: Query,
    Mutation: Mutation,
    ...type
}