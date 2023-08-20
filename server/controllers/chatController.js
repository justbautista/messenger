const User = require("../models/User")
const Chat = require("../models/Chat")
const { generateResponse } = require("../helpers/authHelpers")
const { formatChatList, loadMessages } = require("../helpers/chatHelpers")

const createChat = async (req, res) => {
	try {
		const { members, chatName } = req.body

		let name = members.join(", ")

		if (chatName.trim() !== "") {
			name = chatName
		}

		const findChat = await Chat.findOne({
			members: { $all: members, $size: members.length },
		})

		if (findChat) {
			return res
				.status(409)
				.send(generateResponse(false, "Chat already exists"))
		}

		const chat = await Chat.create({ chatName: name, members: members })
		await User.updateMany(
			{ username: { $in: members } },
			{ $push: { chatRooms: { room: chat["_id"], read: false } } }
		)

		return res.send(
			generateResponse(true, "Chat created!", {
				roomId: chat["_id"].toString(),
			})
		)
	} catch (err) {
		return res.status(500).send(
			generateResponse(false, "Problem creating chat", {
				error: err,
			})
		)
	}
}

const getChatList = async (req, res) => {
	try {
		const { username } = req.body
		const user = await User.findOne({ username: username })

		const chatIds = user["chatRooms"].map((chat) => chat["room"])
		const chatList = await Chat.find({ _id: { $in: chatIds } })

		if (!chatList) {
			return res
				.status(404)
				.send(
					generateResponse(
						false,
						"One or more chatRooms do not exist"
					)
				)
		}

		const formattedChatList = formatChatList(chatList, user["chatRooms"])

		return res.send(
			generateResponse(true, "Fetched chat list", {
				chatList: formattedChatList,
			})
		)
	} catch (err) {
		return res.status(500).send(
			generateResponse(false, "Problem when fetching chat list", {
				error: err,
			})
		)
	}
}

const getMessages = async (req, res) => {
	try {
		const { chatId } = req.params
		const msgsLoaded = parseInt(req.query["msgsLoaded"])
		const chat = await Chat.findById(chatId).select("-messages._id")

		if (!chat) {
			return res
				.status(404)
				.send(generateResponse(false, "Couldn't find chat"))
		}

		const messages = loadMessages(chat["messages"], msgsLoaded)

		return res.send(
			generateResponse(true, "Fetched batch of messages!", {
				chatName: chat["chatName"],
				messages: messages,
			})
		)
	} catch (err) {
		return res.status(500).send(
			generateResponse(false, "Problem with fetching chat", {
				error: err,
			})
		)
	}
}

const deleteChat = async (req, res) => {
	try {
		const { chatId } = req.params
		const { username } = req.body

		const updatedChat = await Chat.findOneAndUpdate(
			{ _id: chatId },
			{ $pull: { members: username } },
			{ new: true }
		)

		if (!updatedChat) {
			return res
				.status(404)
				.send(generateResponse(false, "Chat not found"))
		}

		if (updatedChat["members"].length === 0) {
			await Chat.deleteOne({ _id: chatId })
		}

		await User.updateOne(
			{ username: username },
			{ $pull: { chatRooms: { room: chatId } } }
		)

		return res.send(generateResponse(true, "Successfully deleted chat!"))
	} catch (err) {
		return res.status(500).send(
			generateResponse(false, "Problem with deleting chat", {
				error: err,
			})
		)
	}
}

module.exports = { createChat, getChatList, getMessages, deleteChat }
