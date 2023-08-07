import React, { useState, useEffect } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError, getAccessToken } from "../helpers/helpers"
import { useChat } from "../contexts/ChatContext"
import { useSocket } from "../contexts/SocketContext"

export default function MessageBox() {
	const { selectedChat, messageStore, updateMessageStore } = useChat()
	const { sendMessage } = useSocket()
	const [currentMessages, setCurrentMessages] = useState({})
	const [message, setMessage] = useState("")
    
	/*
        currentMessages
        {
            chatId: chatId,
            messages: messagesObject
        }

        messageStore
        {
            chatId: {
                messages: messagesObject
            },
            ...
        }
    */

	useEffect(() => {
		const getMessages = async () => {
			try {
				if (!selectedChat) {
					return
				}

				if (currentMessages["messages"]) {
					updateMessageStore(
						selectedChat,
						currentMessages["messages"]
					)
				}

				// if no chat in message store, fetch it and add to message store
				if (!messageStore[selectedChat]) {
					const response = await api.get(
						`/chats/${selectedChat}/messages`,
						{ params: { msgsLoaded: 0 } }
					)

					updateMessageStore(selectedChat, response.data["messages"])
					setCurrentMessages({
						chatId: selectedChat,
						messages: response.data["messages"],
					})
				} else {
					// if there is a chat, fetch from message store
					setCurrentMessages({
						chatId: selectedChat,
						messages: messageStore[selectedChat],
					})
				}
			} catch (err) {
				console.error(generateAxiosError(err))
			}
		}

		getMessages()
	}, [selectedChat])

	const loadMoreMessages = async () => {
		if (!currentMessages["messages"]["allMessagesLoaded"]) {
			const response = await api.get(`/chats/${selectedChat}/messages`, {
				params: {
					msgsLoaded:
						currentMessages["messages"]["totalMessagesLoaded"],
				},
			})

			setCurrentMessages((prev) => ({
				...prev,
				messages: {
					allMessagesLoaded:
						response.data["messages"]["allMessagesLoaded"],
					totalMessagesLoaded:
						response.data["messages"]["totalMessagesLoaded"],
					messages: [
						...prev["messages"]["messages"],
						response.data["messages"]["messages"],
					],
				},
			}))
		}
	}

	const send = () => {
		if (message === "") {
			return
		}

		const messageData = {
			room: selectedChat,
			message: message,
			auth: {
				token: getAccessToken(),
			},
		}

		sendMessage(messageData)
	}

	// TODO: work on sending messsages to server
	return (
		<div>
			{currentMessages["messages"] ? (
				<div>
					<p>{currentMessages["chatId"]}</p>
					<p>
						{currentMessages["messages"][
							"allMessagesLoaded"
						].toString()}
					</p>
					<p>{currentMessages["messages"]["totalMessagesLoaded"]}</p>
				</div>
			) : (
				<p>Loading messages</p>
			)}
			{currentMessages["messages"] &&
				!currentMessages["messages"]["allMessagesLoaded"] && (
					<p>***load more***</p>
				)}
			<input
				type="text"
				name="message"
				value={message}
				onChange={(event) => {
					setMessage(event.target.value)
				}}
                onKeyDown={(event) => {
                    event.key === "Enter" && send()
                }}
			/>
		</div>
	)
}
// TODO: add a receive flag, messageStore shouldnt be updated on receive, it should update the chatList but not messageStore,
// if there is a receive flag, the react will fetch messages from backend then update messageStore
// only sends update messageStore
// however, active chats can get received messages to
