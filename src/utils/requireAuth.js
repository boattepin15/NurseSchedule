const jwt = require("jsonwebtoken")

function requiredAuth({ authorization }) {
    return jwt.verify(authorization, process.env.JWT_SECRET)
}

module.exports = requiredAuth