import React, { useState, useEffect } from "react"
import { useChat } from "../contexts/ChatContext"
import { useSocket } from "../contexts/SocketContext"
import { useAuth } from "../contexts/AuthContext"

export default function Chat({ chat }) {
    const { username } = useAuth()
	const { selectedChat, setSelectedChat, setSessionReadTracker } = useChat()
    const { socket, read } = useSocket()
    const [receivedMessage, setReceivedMessage] = useState(chat["latestMessage"]["message"])
    const [readStatus, setReadStatus] = useState(chat["read"])

    useEffect(() => {
		if (socket) {
			socket.on("receive-message", (receivedMessageData) => {
                // if message received is this chat
                if (receivedMessageData["room"] === chat["chatId"]) {
                    setReceivedMessage(receivedMessageData)

                    // is this chat selected
                    if (chat["chatId"] === selectedChat) {
                        const readData = {
                            room: selectedChat,
                            username: username
                        }
                        
                        read(readData)
                        setReadStatus(true)
                        setSessionReadTracker((prev) => ({ ...prev, [chat.chatId]: true }))
                    } else {
                        setReadStatus(false)
                        setSessionReadTracker((prev) => ({ ...prev, [chat.chatId]: false }))
                    }
                }
			})
		}

        return () => socket && socket.off("receive-message")
	}, [socket])

	return (
		<div className="border-solid border-2 border-sky-500" onClick={() => setSelectedChat(chat["chatId"])}>
			<p>{chat["chatName"]}</p>
			<p>{chat["chatId"]}</p>
			<p>{chat["updatedAt"]}</p>
            <p>{readStatus}</p>
			<p>{receivedMessage["message"]}</p>
			<p>{`selected chat: ${selectedChat} `}</p>
		</div>
	)
}
