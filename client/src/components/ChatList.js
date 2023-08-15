import React, { useState, useEffect } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"
import { useChat } from "../contexts/ChatContext"
import Chat from "./Chat"
import { useSocket } from "../contexts/SocketContext"

export default function ChatList() {
	const [chatList, setChatList] = useState([])
	const { selectedChat, setSelectedChat, setSessionReadTracker } = useChat()
	const { joinRoom } = useSocket()

	useEffect(() => {
		const getChatList = async () => {
			try {
				const response = await api.get("/chats/list")
				setChatList(response.data["chatList"])
			} catch (err) {
				console.error(generateAxiosError(err))
			}
		}
		getChatList()
	}, [])

	useEffect(() => {
		if (chatList.length > 0 && !selectedChat) {
			setSelectedChat(chatList[0]["chatId"])

            for (const chat of chatList) {
                joinRoom(chat["chatId"])
            }
    
            const createChatListTracker = chatList.reduce(
                (chats, chat) => ({
                    ...chats,
                    [chat.chatId]: chatList[0]["chatId"] === chat.chatId ? true : false,
                }),
                {}
            )
            setSessionReadTracker(createChatListTracker)
		}

	}, [chatList])

	return (
		<div>
			{chatList.map((chat) => (
				<Chat key={chat["chatId"]} chat={chat} />
			))}
		</div>
	)
}
