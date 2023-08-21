import React, { useState, useEffect, useRef } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"
import { useChat } from "../contexts/ChatContext"
import Chat from "./Chat"
import { useSocket } from "../contexts/SocketContext"
import NewChatModal from "./NewChatModal"

export default function ChatList({
	responsiveChatList,
	toggleChatList,
	setToggleChatList,
}) {
	const [chatList, setChatList] = useState([])
	const {
		selectedChat,
		setSelectedChat,
		setSessionReadTracker,
		sentMessage,
		setShowNewChatModal,
		showNewChatModal,
	} = useChat()
	const { joinRoom } = useSocket()
	const chatListRef = useRef(null)

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
		if (!responsiveChatList) {
			return
		}

		const handleOutsideClick = (event) => {
			if (
				chatListRef.current &&
				!chatListRef.current.contains(event.target) &&
				toggleChatList
			) {
				setToggleChatList(false)
			}
		}

		document.addEventListener("mousedown", handleOutsideClick)

		return () =>
			responsiveChatList &&
			document.removeEventListener("mousedown", handleOutsideClick)
	}, [responsiveChatList, toggleChatList])

	useEffect(() => {
		if (chatList.length > 0) {
			setSelectedChat(chatList[0]["chatId"])

			for (const chat of chatList) {
				joinRoom(chat["chatId"])
			}
			console.log(chatList)
			const createChatListTracker = chatList.reduce(
				(chats, chat) => ({
					...chats,
					[chat.chatId]:
						chatList[0]["chatId"] === chat.chatId
							? true
							: chat["read"],
				}),
				{}
			)
			console.log(createChatListTracker)
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
		<div
			className={
				responsiveChatList
					? toggleChatList
						? "h-full w-4/5 absolute flex flex-col p-2 overflow-y-hidden top-0 left-0 bg-white border-e shadow-2xl rounded-xl transition-all ease-in-out origin-left"
						: "w-0 h-full absolute flex flex-col p-0 overflow-y-hidden top-0 left-0 bg-white border-e shadow-2xl rounded-xl transition-all ease-in-out origin-left"
					: "cols-span-1 flex flex-col p-2 overflow-y-hidden"
			}
			ref={chatListRef}
		>
			{showNewChatModal && <NewChatModal setChatList={setChatList} />}
			<div className="m-2">
				<svg
					className="h-6 w-6 hover:text-red-600 text-red-400"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					strokeWidth="2"
					stroke="currentColor"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
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
					<Chat
						key={chat["chatId"]}
						chat={chat}
						setChatList={setChatList}
						chatList={chatList}
						setToggleChatList={setToggleChatList}
						responsiveChatList={responsiveChatList}
					/>
				))}
			</div>
		</div>
	)
}
