const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const wait  = (ms) => {
    return new Promise( (resolve) => setTimeout(resolve, ms))
}

mongo = mongoose.connect(`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@db.udz6mij.mongodb.net/Nurse`)
.then(() => {
    console.log('connect database success');

})
.catch( err => {
 console.log(`database error ${err}`);
})

const connecting = async() => {
	for (let i = 1; i<=10; i++){
		try{
			conn = await mongo
			return null

		}catch(error){
			return error
		}
	}
}

module.exports = {
    connecting,
    wait
}