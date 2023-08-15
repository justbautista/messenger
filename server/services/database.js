const mongoose = require("mongoose")

const initializeDatabase = async () => {
	try {
		console.log("DATABASE <CONNECTING>...")
		await mongoose.connect(process.env.MONGO_DB_URI)
		console.log("DATABASE <CONNECTED>")
	} catch (err) {
		console.error(`DATABASE <CONNECTION FAILED>: ${err}`)
	}
}

module.exports = initializeDatabase