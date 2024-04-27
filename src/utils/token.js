const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')
dotenv.config()


const createToken = (sub) => {
	const token = jwt.sign({user_id:sub }, process.env.JWT_SECRET, {expiresIn: "7d"})

    return token
}
const verifyToken = (token, req, res) => {
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        return decoded

    }catch(error){
        res.status(401)
    }
    
}
module.exports = {
    createToken,
    verifyToken
} 
  