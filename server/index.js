require("dotenv").config("../.env")
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_DB_URI)
		console.log("Database connection SUCCESSFUL")
	} catch (err) {
		console.error("Database connection FAILED: " + err)
	}
}

connectDB()

const authRouter = require("./routes/authRouter")

app.use("/v1/auth", authRouter)

const port = process.env.PORT || 8000
app.listen(port, () => {
	console.log(`Listening on port ${port}`)
})
