require("dotenv").config("../.env")
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const http = require("http")
const { Server } = require("socket.io")
const { verifyAccessToken } = require("./helpers/authHelpers")
const User = require("./models/User")

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: process.env.CLIENT_URI,
		methods: ["GET", "POST"],
	},
})

app.use(cors({ origin: process.env.CLIENT_URI, credentials: true, exposedHeaders: ["Authorization"] }))
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

io.use(async (socket, next) => {
	try {
		const verified = verifyAccessToken(socket.handshake.auth["token"].split(" ")[1])
		const user = await User.exists({ username: verified["username"] })

		if (user) {
			next()
		} else {
			next(new Error("User not found"))
		}
	} catch (err) {
		next(new Error("Invalid token"))
	}
})

io.on("connection", (socket) => {
	console.log(`${socket.id} is connected`)

	socket.on("send-message", (data) => {
		console.log(data)
		socket.to(data.room).emit("recieve-message", data)
	})

	socket.on("join-room", (data) => {
        console.log(data)
		socket.join(data)
	})

	socket.on("leave-room", (data) => {
		socket.leave(data)
	})

    socket.on("test", (data) => {socket.emit("receive_message", data)})
})

const port = process.env.PORT || 8000
server.listen(port, () => {
	console.log(`Listening on port ${port}...`)
})
