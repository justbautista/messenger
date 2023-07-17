const express = require("express")
const router = express.Router()
const { checkAuth } = require("../helpers/authHelpers")
const { createChat, getChatList, getMessages, deleteChat } = require("../controllers/chatController")

router.post("/", checkAuth, createChat)
router.get("/list", checkAuth, getChatList) // gets the chats the user is a part of, the sidebar
router.get("/:chatId/messages", checkAuth, getMessages) // get messages from chat, req has number of messages already loaded starting from 0 (increases on client)
router.delete("/:chatId", checkAuth, deleteChat)

module.exports = router

// sockets are in charge of only realtime notifications, live send/recieve message, socket updates database
// client sends post req to create a chat/room, server responds with room id, client sends join room for socket