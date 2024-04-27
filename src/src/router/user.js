const User = require('../model/User.js')
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.js')
const  {_ , verifyToken} = require('../utils/token.js')




router.get('/profile',authMiddleware , async(req, res) => {

    try{
        const token = req.query.token || req.headers['x-access-token']
        const pk = verifyToken(token)
        const user = await User.findById(pk.user_id.sub)
       
        res.send({
            data:user
        })

    }catch( error) {
        res.status(404)
        .json({
            Error:error
        })
        
    }
})

router.patch('/profile', authMiddleware ,async(req, res) => {
    try{
        const token = req.query.token || req.headers['x-access-token']
        const pk = verifyToken(token)
        const user =  await User.findByIdAndUpdate({_id:pk.user_id.sub}, 
        {
            $set:req.body
        },
        {
            $new:true
        }
        )

        res.send({
            message:"update success"
        })

    }catch( error ){
        res.status(500)
        .json({error})
    }
})

router.get('/test', (req, res) => {
    res.send('PASS')
})
module.exports = router