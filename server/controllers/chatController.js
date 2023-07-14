const User = require("../models/User")
const Chat = require("../models/Chat")
const { generateJsonResponse } = require("../helpers/authHelpers")
const { formatChatList, loadMessages } = require("../helpers/chatHelpers")

const createChat = async (req, res) => {
	try {
		const { members, chatName } = req.body

		let name = members.join(", ")

		if (chatName.trim() !== "") {
			name = chatName
		}

		const chat = await Chat.create({ chatName: name, members: members })
		await User.updateMany(
			{ username: { $in: members } },
			{ $push: { chatRooms: chat["_id"] } }
		)

		return res.send(
			generateJsonResponse(true, "Chat created!", {
				roomId: chat["_id"].toString(),
			})
		)
	} catch (err) {
		return res.status(500).send(
			generateJsonResponse(false, "Problem creating chat", {
				error: err,
			})
		)
	}
}

const getChatList = async (req, res) => {
	try {
		const { username } = req.body
		const user = await User.findOne({ username: username })

		const chatList = await Chat.find({ _id: { $in: user["chatRooms"] } })

		if (!chatList) {
			return res
				.status(404)
				.send(
					generateJsonResponse(
						false,
						"One or more chatRooms do not exist"
					)
				)
		}

		const formattedChatList = formatChatList(chatList)

		return res.send(
			generateJsonResponse(true, "Fetched chat list", {
				chatList: formattedChatList,
			})
		)
	} catch (err) {
		return res.status(500).send(
			generateJsonResponse(false, "Problem when fetching chat list", {
				error: err,
			})
		)
	}
}

const getMessages = async (req, res) => {
	try {
		const { chatId } = req.params
		const msgsLoaded = parseInt(req.params["msgsLoaded"])
		const chat = await Chat.findById(chatId)

		if (!chat) {
			return res
				.status(404)
				.send(generateJsonResponse(false, "Couldn't find chat"))
		}

		const messages = loadMessages(chat["messages"], msgsLoaded)

		return res.send(
			generateJsonResponse(true, "Fetched batch of messages!", {
				messages: messages,
			})
		)
	} catch (err) {
		return res.status(500).send(
			generateJsonResponse(false, "Problem with fetching chat", {
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
				.send(generateJsonResponse(false, "Chat not found"))
		}

		if (updatedChat["members"].length === 0) {
			await Chat.deleteOne({ _id: chatId })
		}

		await User.updateOne(
			{ username: username },
			{ $pull: { chatRooms: chatId } }
		)

		return res.send(
			generateJsonResponse(true, "Successfully deleted chat!")
		)
	} catch (err) {
		return res.status(500).send(
			generateJsonResponse(false, "Problem with deleting chat", {
				error: err,
			})
		)
	}
}

module.exports = { createChat, getChatList, getMessages, deleteChat }
