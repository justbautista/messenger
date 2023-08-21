const express = require("express")
const router = express.Router()
const { checkAuth } = require("../helpers/authHelpers")
const {
	createChat,
	getChatList,
	getMessages,
	deleteChat,
} = require("../controllers/chatController")

router.post("/", checkAuth, createChat)
router.get("/list", checkAuth, getChatList)
router.get("/:chatId/messages", checkAuth, getMessages)
router.delete("/:chatId", checkAuth, deleteChat)

module.exports = router
