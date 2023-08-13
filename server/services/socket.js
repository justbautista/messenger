const { Server } = require("socket.io")
const {
	verifyAccessToken,
	generateResponse,
} = require("../helpers/authHelpers")
const User = require("../models/User")
const Chat = require("../models/Chat")

const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: process.env.CLIENT_URI,
			methods: ["GET", "POST"],
		},
	})

	io.use(async (socket, next) => {
		try {
			const verified = verifyAccessToken(
				socket.handshake.auth["token"].split(" ")[1]
			)
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

		socket.on("send-message", async (messageData, callback) => {
			console.log(messageData)
			/*
                {
                    room: selectedChat,
                    message: message,
                    senderUsername: username,
                }
            */
			try {
				const chat = await Chat.findOneAndUpdate(
					{ _id: messageData["room"] },
					{
						$push: {
							messages: {
								senderUsername: messageData["senderUsername"],
								message: messageData["message"],
							},
						},
					}
				)

				if (chat) {
					const membersExceptSender = chat["members"].filter(
						(member) => member !== messageData["senderUsername"]
					)
					await User.updateMany(
						{
							username: { $in: membersExceptSender },
							"chatRooms.room": messageData["room"],
						},
						{ $set: { "chatRooms.$.read": false } }
					)

					socket
						.to(messageData["room"])
						.emit("receive-message", messageData)
					callback(
						generateResponse(true, "Successfully sent message")
					)
				} else {
					callback(generateResponse(false, "Problem saving message"))
				}
			} catch (err) {
				callback(
					generateResponse(false, "Problem sending message", {
						error: err,
					})
				)
			}
		})

		socket.on("read", async (readData, callback) => {
			console.log("read", readData)
			try {
				await User.findOneAndUpdate(
					{
						username: readData["username"],
						"chatRooms.room": readData["room"],
					},
					{ $set: { "chatRooms.$.read": true } }
				)

				callback(
					generateResponse(true, `${readData["username"]} read message`)
				)
			} catch (err) {
				callback(
					generateResponse(false, "Problem reading message", {
						error: err,
					})
				)
			}
		})

		socket.on("join-room", (data) => {
			console.log(data)
			socket.join(data)
		})

		socket.on("leave-room", (data) => {
			socket.leave(data)
		})

		socket.on("test", (data) => {
			socket.emit("receive_message", data)
		})
	})
}

module.exports = initializeSocket
