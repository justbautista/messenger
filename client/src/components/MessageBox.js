import React, { useState, useEffect } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError, getAccessToken } from "../helpers/helpers"
import { useChat } from "../contexts/ChatContext"
import { useSocket } from "../contexts/SocketContext"
import { useAuth } from "../contexts/AuthContext"

export default function MessageBox() {
	const { username } = useAuth()
	const { selectedChat, messageStore, updateMessageStore } = useChat()
	const { sendMessage, read } = useSocket()
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
                newMessages: boolean ** (used for receive socket, so when changing chat, if there are new messages, get from server instead of messageStore)
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
                
                // update messageStore with currentMessages before anything else
				if (currentMessages["messages"] && currentMessages["messages"]["messages"].length > 0) {
					updateMessageStore(
						currentMessages["chatId"],
						currentMessages["messages"]
					)
				}

				// if no chat in messageStore, fetch it and add to messageStore and update currentMessages
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
                    // if there is chat in messageStore and there are new messages in newly selected chat, update messageStore and currentMessages
					if (messageStore[selectedChat]["anyNewMessages"]) {
						const response = await api.get(
							`/chats/${selectedChat}/messages`,
							{
								params: {
									msgsLoaded:
										messageStore[selectedChat]["messages"][
											"totalMessagesLoaded"
										],
								},
							}
						)

						updateMessageStore(
							selectedChat,
							response.data["messages"]
						)
						setCurrentMessages({
							chatId: selectedChat,
							messages: response.data["messages"],
						})
					} else {
                        // if there is a chat and no new messages, fetch from messageStore
						setCurrentMessages({
							chatId: selectedChat,
							messages: messageStore[selectedChat],
						})
					}
				}
                
                // mark as read
                const readData = {
                    room: selectedChat,
                    username: username,
                }
                read(readData)
			} catch (err) {
				console.error(generateAxiosError(err))
			}
		}

		getMessages()
	}, [selectedChat])

	const loadMoreMessages = async () => {
        // if not all messages are loaded, fetch more from api
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
			senderUsername: username,
		}

		sendMessage(messageData)
		setCurrentMessages((prev) => ({
			...prev,
			messages: {
				...prev["messages"],
				totalMessagesLoaded:
					prev["messages"]["totalMessagesLoaded"] + 1,
				messages: [
					{
						senderUsername: messageData["senderUsername"],
						message: messageData["message"],
						timeStamp: Date.now(),
					},
					...prev["messages"]["messages"],
				],
			},
		}))
	}

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
