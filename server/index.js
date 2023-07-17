require("dotenv").config("../.env")
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")

const app = express()

app.use(cors({ origin: process.env.CLIENT_URI, credentials: true }))
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
const chatRouter = require("./routes/chatRouter")
const userRouter = require("./routes/userRouter")

app.use("/v1/auth", authRouter)
app.use("/v1/chats", chatRouter)
app.use("/v1/users", userRouter)

const port = process.env.PORT || 8000
app.listen(port, () => {
	console.log(`Listening on port ${port}`)
})
