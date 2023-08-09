const mongoose = require("mongoose")

const initializeDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGO_DB_URI)
		console.log("Database connection SUCCESSFUL")
	} catch (err) {
		console.error("Database connection FAILED: " + err)
	}
}

module.exports = initializeDatabase