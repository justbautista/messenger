import React, { useState, useEffect } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"
import { useChat } from "../contexts/ChatContext"
import Chat from "./Chat"
import { useSocket } from "../contexts/SocketContext"

export default function ChatList() {
	const [chatList, setChatList] = useState([])
	const {
		selectedChat,
		setSelectedChat,
		setSessionReadTracker,
		sentMessage,
		setShowNewChatModal,
	} = useChat()
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
					[chat.chatId]:
						chatList[0]["chatId"] === chat.chatId ? true : false,
				}),
				{}
			)
			setSessionReadTracker(createChatListTracker)
		}
	}, [chatList])

	useEffect(() => {
		if (chatList.length === 0) {
			return
		}

		// if the sent message is NOT from the first chat in chatList, move it to the front
		if (selectedChat !== chatList[0]["chatId"]) {
			const index = chatList.findIndex(
				(chat) => chat["chatId"] === selectedChat
			)
			if (index === -1) {
				return chatList
			}

			const newChatList = [...chatList]
			newChatList.splice(index, 1)
			newChatList.unshift(chatList[index])

			setChatList(newChatList)
		}
	}, [sentMessage])

	return (
		<div className="flex flex-col p-2 overflow-y-hidden">
			<div className="m-2">
				<svg
					className="h-6 w-6 hover:text-red-600 text-red-400"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
					onClick={() => setShowNewChatModal(true)}
				>
					{" "}
					<path stroke="none" d="M0 0h24v24H0z" />{" "}
					<line x1="12" y1="5" x2="12" y2="19" />{" "}
					<line x1="5" y1="12" x2="19" y2="12" />
				</svg>
			</div>
            <div className="grow overflow-y-auto">
                {chatList.map((chat) => (
                    <Chat key={chat["chatId"]} chat={chat} />
                ))}
            </div>
		</div>
	)
}
