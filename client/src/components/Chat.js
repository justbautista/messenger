import React, { useState, useEffect } from "react"
import { useChat } from "../contexts/ChatContext"

export default function Chat({ chat }) {
	const { selectedChat, setSelectedChat } = useChat()

	return (
		<div className="border-solid border-2 border-sky-500" onClick={() => setSelectedChat(chat["chatId"])}>
			<p>{chat["chatName"]}</p>
			<p>{chat["chatId"]}</p>
			<p>{chat["updatedAt"]}</p>
			{/* <p>{chat["latestMessage"]}</p> */}
			<p>{`selected chat: ${selectedChat} `}</p>
		</div>
	)
}
