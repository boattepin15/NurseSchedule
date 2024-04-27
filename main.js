const { app, apollo } = require('./src/server.js')
const dotenv = require('dotenv')
const { connecting, wait } = require('./src/config/database.js')
dotenv.config()
const PORT = process.env.PORT
const http = require("http")

const startServer = async () => {

	const httpServer = http.createServer(app);

	// รอการเชื่อมต่อ database
	await connecting()
	await wait(1000)

	await apollo.start()

	apollo.applyMiddleware({ app })

	// หลังจากการเชื่อมต่อ database เสร็จสิ้นก็นให้ทำการเริ่มรัน server
	// app.listen(PORT, "0.0.0.0", () => {
	// 	console.log(`🚀 Server is running on 0.0.0.0:${PORT}`)
	// })
	httpServer.listen({ port: PORT })
	console.log(`🚀 Server is running on 0.0.0.0:${PORT}`)

}

startServer()