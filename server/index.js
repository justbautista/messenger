require("dotenv").config("../.env")
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const http = require("http")
const initializeDatabase = require("./services/database")
const initializeSocket = require("./services/socket")

const app = express()
const server = http.createServer(app)

app.use(
	cors({
		origin: process.env.CLIENT_URI,
		credentials: true,
		exposedHeaders: ["Authorization"],
	})
)
app.use(express.json())
app.use(cookieParser())

initializeDatabase()

const authRouter = require("./routes/authRouter")
const chatRouter = require("./routes/chatRouter")
const userRouter = require("./routes/userRouter")

app.use("/v1/auth", authRouter)
app.use("/v1/chats", chatRouter)
app.use("/v1/users", userRouter)

initializeSocket(server)

const port = process.env.PORT || 8000
server.listen(port, () => {
	console.log(`SERVER <LISTENING>: PORT ${port}`)
})
