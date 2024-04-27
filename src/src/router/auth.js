const  express  = require('express')
const  bcrypt = require('bcryptjs')
const User = require('../model/User.js')
const dotenv = require('dotenv')
const router = express.Router()
const  {createToken, verifyToken} = require('../utils/token.js')
const authMiddleware = require('../middlewares/auth.js')
dotenv.config()

const saltRounds = 10;



router.post("/register", async (req, res) => {
	

	try {
		
		const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(req.body.password, salt)

		const findUser = await User.findOne({email:req.body.email})
		if(findUser) return res.send({
			message:"email been used"
		})

		const user = await User.create({
			frist_name:req.body.frist_name,
			last_name:req.body.last_name,
			email:req.body.email,
			password:hash,
			tokenVersion:1
		})


		res.send({ user: user })
	} catch (error) {
		console.log(error)
		res.send({ error })
	}
})

router.post('/login', async(req, res) => {
	try{
		
		const user  = await User.findOne({email: req.body.email})
		if (!user) {
			return res.sendStatus(401)
		}

		if (!bcrypt.compareSync(req.body.password, user.password)) {
			return res.sendStatus(401)
		}

		const token = createToken({ sub: user._id, v: user.tokenVersion })

		res.send({
			user:user,
			token:token
		})

	}catch( error ){
		res.send({
			error
		}) 
	}
	
})

router.delete("/logout",authMiddleware , async (req, res) => {
	const token = req.query.token || req.headers['x-access-token']
	const result = verifyToken(token)

	const user = await User.findById(result.user_id.sub)
	user.tokenVersion += 1
	await user.save()
	res.send({ status: "sucess" })

})


router.get("/test", (req, res) => {
	res.send("TEST auth")
	console.log(createToken);
})


module.exports = router