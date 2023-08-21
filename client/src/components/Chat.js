import React, { useState, useEffect } from "react"
import { useChat } from "../contexts/ChatContext"
import { useSocket } from "../contexts/SocketContext"
import { useAuth } from "../contexts/AuthContext"
import { formatDate } from "../helpers/helpers"
import ContextMenu from "./ContextMenu"

export default function Chat({
	chat,
	chatList,
	setChatList,
	responsiveChatList,
	setToggleChatList,
}) {
	const { username } = useAuth()
	const {
		selectedChat,
		setSelectedChat,
		setSessionReadTracker,
		sessionReadTracker,
		sentMessage,
	} = useChat()
	const { socket, read } = useSocket()
	const [latestMessage, setLatestMessage] = useState(chat["latestMessage"])
	const [readStatus, setReadStatus] = useState(chat["read"])
	const [contextMenuPosition, setContextMenuPosition] = useState(null)

	useEffect(() => {
		if (socket) {
			socket.on("latest-message", (receivedMessageData) => {
				// if message received is this chat
				if (receivedMessageData["room"] === chat["chatId"]) {
					const msgDataWithTimestamp = {
						...receivedMessageData,
						timeStamp: new Date().toISOString(),
					}
					setLatestMessage(msgDataWithTimestamp)

					// is this chat selected
					if (chat["chatId"] === selectedChat) {
						const readData = {
							room: selectedChat,
							username: username,
						}

						read(readData)
						setSessionReadTracker((prev) => ({
							...prev,
							[chat.chatId]: true,
						}))
					} else {
						setSessionReadTracker((prev) => ({
							...prev,
							[chat.chatId]: false,
						}))
					}
				}
			})
		}

		return () => socket && socket.off("latest-message")
	}, [socket, selectedChat])

	useEffect(() => {
		if (selectedChat === chat["chatId"] && sentMessage["timeStamp"]) {
			setLatestMessage(sentMessage)
		}
	}, [sentMessage])

	useEffect(() => {
		if (sessionReadTracker[chat["chatId"]]) {
			setReadStatus(true)
		} else {
			setReadStatus(false)
		}
	}, [sessionReadTracker])

	const handleContextMenu = (e) => {
		e.preventDefault()
		const rect = e.currentTarget.getBoundingClientRect()
		const offsetX = e.clientX - rect.left
		const offsetY = e.clientY - rect.top
        setContextMenuPosition({ x: offsetX, y: offsetY })
	}

	const handleChatSelection = () => {
		if (responsiveChatList) {
			setToggleChatList(false)
		}

		setSelectedChat(chat["chatId"])
	}

	return (
		<div
			className={
				selectedChat === chat["chatId"]
					? "relative transition ease-in-out p-4 my-2 rounded-xl bg-red-400 text-white"
					: "relative transition ease-in-out p-4 my-2 rounded-xl hover:bg-slate-200"
			}
			onClick={handleChatSelection}
			onContextMenu={handleContextMenu}
		>
			<div className="flex flex-row justify-between items-center gap-2">
				<p className="font-bold truncate col-span-2">
					{chat["chatName"]}
				</p>
				<p className="shrink-0">
					{latestMessage
						? formatDate(latestMessage["timeStamp"])
						: formatDate(chat["updatedAt"])}
				</p>
			</div>
			<div className="flex flex-row items-center gap-2">
				{!readStatus && (
					<span className="shrink-0 rounded-full h-3 w-3 bg-red-600"></span>
				)}
				<p className="font-light pr-2 truncate">
					{latestMessage["message"] || "No Messages"}
				</p>
			</div>
			{contextMenuPosition && (
				<ContextMenu
					x={contextMenuPosition.x}
					y={contextMenuPosition.y}
					chat={chat}
					chatList={chatList}
					setChatList={setChatList}
					setContextMenuPosition={setContextMenuPosition}
				/>
			)}
		</div>
	)
}
