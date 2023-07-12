const User = require("../models/User")
const Chat = require("../models/Chat")
const { generateJsonResponse } = require("../helpers/authHelpers")

const createChat = async (req, res) => {
	try {
		const { members, chatName } = req.body

		let name = members.join(", ")

		if (chatName.trim() !== "") {
			name = chatName
		}

		// const memberList = await User.find({ username: { $in: members } })
		// const memberIds = memberList.map((member) => member._id)

		const chat = await Chat.create({ chatName: name, members: members })
		await User.updateMany(
			{ username: { $in: members } },
			{ $push: { chatRooms: chat._id } }
		)

		return res.send(generateJsonResponse(true, "Chat created!", { roomId: chat._id.toString() }))
	} catch (err) {
		return res.status(500).send(generateJsonResponse(false, "Problem creating chat", { error: err }))
	}
}

const getChatList = async (req, res) => {
    try {
        const { username } = req.body
        const user = await User.findOne({ username: username })

        const chatList = await Chat.find({ _id: { $in: user["chatRooms"] } }) 
        console.log(chatList)
    } catch (err) {
    }
}

const getChat = async (req, res) => {

}

module.exports = { createChat, getChatList }
