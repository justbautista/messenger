import React, { useState, useEffect } from "react"
import { useChat } from "../contexts/ChatContext"
import { useSocket } from "../contexts/SocketContext"
import { useAuth } from "../contexts/AuthContext"
import { formatDate } from "../helpers/helpers"

export default function Chat({ chat }) {
	const { username } = useAuth()
	const {
		selectedChat,
		setSelectedChat,
		setSessionReadTracker,
		sentMessage,
	} = useChat()
	const { socket, read } = useSocket()
	const [latestMessage, setLatestMessage] = useState(chat["latestMessage"])
	const [readStatus, setReadStatus] = useState(chat["read"])

	useEffect(() => {
		if (socket) {
			socket.on("latest-message", (receivedMessageData) => {
                console.log("triggerd chat message receive")
				// if message received is this chat
				if (receivedMessageData["room"] === chat["chatId"]) {
                    const msgDataWithTimestamp = {
                        ...receivedMessageData,
                        timeStamp: new Date().toISOString()
                    }
					setLatestMessage(msgDataWithTimestamp)

					// is this chat selected
					if (chat["chatId"] === selectedChat) {
						const readData = {
							room: selectedChat,
							username: username,
						}

						read(readData)
						setReadStatus(true)
						setSessionReadTracker((prev) => ({
							...prev,
							[chat.chatId]: true,
						}))
					} else {
                        console.log("falsy")
						setReadStatus(false)
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

	return (
		<div
			className={
				selectedChat === chat["chatId"]
					? "transition ease-in-out p-4 my-2 rounded-xl bg-red-400 text-white"
					: "transition ease-in-out p-4 my-2 rounded-xl hover:bg-slate-200"
			}
			onClick={() => setSelectedChat(chat["chatId"])}
		>
			<div className="grid grid-cols-3 gap-2">
				<p className="font-bold truncate col-span-2">
					{chat["chatName"]}
				</p>
				<p className="justify-self-end">
					{latestMessage ? formatDate(latestMessage["timeStamp"]) : "No messages"}
				</p>
			</div>
			<p className="font-light pr-2 truncate">
				{latestMessage["message"]}
			</p>
		</div>
	)
}
