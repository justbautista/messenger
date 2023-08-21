import React, { useState, useEffect } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"
import { useChat } from "../contexts/ChatContext"
import { useSocket } from "../contexts/SocketContext"
import { useAuth } from "../contexts/AuthContext"
import { formatDate } from "../helpers/helpers"
import LoaderPage from "./LoaderPage"

export default function MessageBox({
	responsiveChatList,
	setToggleChatList,
}) {
	const { username } = useAuth()
	const {
		selectedChat,
		messageStore,
		updateMessageStore,
		sessionReadTracker,
		setSessionReadTracker,
		setSentMessage,
	} = useChat()
	const { socket, sendMessage, read } = useSocket()
	const [currentMessages, setCurrentMessages] = useState({})
	const [message, setMessage] = useState("")

	useEffect(() => {
		const getMessages = async () => {
			try {
				if (!selectedChat) {
					return
				}

				// update messageStore with currentMessages before anything else
				if (
					currentMessages["messages"] &&
					currentMessages["messages"]["messages"].length > 0
				) {
					console.log("updates message store")
					updateMessageStore(
						currentMessages["chatId"],
						currentMessages["messages"],
						currentMessages["chatName"]
					)
				}

				// if no chat in messageStore, fetch it and add to messageStore and update currentMessages
				if (!messageStore[selectedChat]) {
					const response = await api.get(
						`/chats/${selectedChat}/messages`,
						{ params: { msgsLoaded: 0 } }
					)
					console.log("not in messageStore, fetch")
					updateMessageStore(
						selectedChat,
						response.data["messages"],
						response.data["chatName"]
					)
					setCurrentMessages({
						chatId: selectedChat,
						chatName: response.data["chatName"],
						messages: response.data["messages"],
					})
				} else {
					// if there is chat in messageStore and there are new messages in newly selected chat, update currentMessages
					if (!sessionReadTracker[selectedChat]) {
						const response = await api.get(
							`/chats/${selectedChat}/messages`,
							{ params: { msgsLoaded: 0 } }
						)

						setCurrentMessages({
							chatId: selectedChat,
							chatName: response.data["chatName"],
							messages: response.data["messages"],
						})
					} else {
						// if there is a chat and no new messages, fetch from messageStore
						console.log("get from messageStore")
						setCurrentMessages({
							chatId: selectedChat,
							chatName: messageStore[selectedChat]["chatName"],
							messages: messageStore[selectedChat]["messages"],
						})
					}
				}

				// mark as read
				const readData = {
					room: selectedChat,
					username: username,
				}
				read(readData)
				setSessionReadTracker((prev) => ({
					...prev,
					[selectedChat]: true,
				}))
				setMessage("")
			} catch (err) {
				console.error(generateAxiosError(err))
			}
		}

		getMessages()
	}, [selectedChat])

	useEffect(() => {
		if (socket) {
			// here should just add to currentMessages only
			socket.on("receive-message", (receivedMessageData) => {
				if (receivedMessageData["room"] === selectedChat) {
					setCurrentMessages((prev) => ({
						...prev,
						messages: {
							...prev["messages"],
							totalMessagesLoaded:
								prev["messages"]["totalMessagesLoaded"] + 1,
							messages: [
								{
									senderUsername:
										receivedMessageData["senderUsername"],
									message: receivedMessageData["message"],
									timeStamp: new Date().toISOString(),
								},
								...prev["messages"]["messages"],
							],
						},
					}))
				}
			})
		}

		return () => socket && socket.off("receive-message")
	}, [socket, selectedChat])

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
						...response.data["messages"]["messages"],
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

		const localMessageData = {
			senderUsername: messageData["senderUsername"],
			message: messageData["message"],
			timeStamp: new Date().toISOString(),
		}

		sendMessage(messageData)
		setCurrentMessages((prev) => ({
			...prev,
			messages: {
				...prev["messages"],
				totalMessagesLoaded:
					prev["messages"]["totalMessagesLoaded"] + 1,
				messages: [localMessageData, ...prev["messages"]["messages"]],
			},
		}))
		setSentMessage(localMessageData)
		setMessage("")
	}

	return (
		<div className={responsiveChatList ? "col-span-3 xl:col-span-3 flex flex-col overflow-y-hidden" : "col-span-2 xl:col-span-3 flex flex-col overflow-y-hidden"}>
			<div className="p-5 border-b flex flex-row gap-2">
				{responsiveChatList && (
					<button className="text-red-400 hover:text-red-600" onClick={() => setToggleChatList(true)}>
						<svg
							className="h-6 w-6"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							strokeWidth="2"
							stroke="currentColor"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							{" "}
							<path stroke="none" d="M0 0h24v24H0z" />{" "}
							<rect x="4" y="4" width="16" height="16" rx="2" />{" "}
							<line x1="9" y1="4" x2="9" y2="20" />
						</svg>
					</button>
				)}
				<p className="font-bold">{currentMessages["chatName"]}</p>
			</div>
			<div className="overflow-y-auto grow flex flex-col-reverse p-2 gap-2">
				{currentMessages["messages"] ? (
					currentMessages["messages"]["messages"].map((message) =>
						username === message["senderUsername"] ? (
							<div
								key={crypto.randomUUID()}
								className="flex flex-col items-end"
							>
								<div className="flex justify-end w-1/2">
									<p className="bg-red-400 p-2 rounded-md text-white break-all">
										{message["message"]}
									</p>
								</div>
								<p className="text-xs px-2">
									{formatDate(message["timeStamp"])}
								</p>
							</div>
						) : (
							<div
								key={crypto.randomUUID()}
								className="flex flex-col items-start"
							>
								<p className="text-xs px-2">
									{message["senderUsername"]}
								</p>
								<div className="flex justify-start w-1/2">
									<p className="bg-slate-200 p-2 rounded-md break-all">
										{message["message"]}
									</p>
								</div>
								<p className="text-xs px-2">
									{formatDate(message["timeStamp"])}
								</p>
							</div>
						)
					)
				) : (
					<LoaderPage />
				)}
				{currentMessages["messages"] &&
					!currentMessages["messages"]["allMessagesLoaded"] && (
						<button
							className="transition ease-in-out mx-auto bg-white my-2 ring ring-red-400 p-2 hover:ring-transparent hover:text-white focus:ring hover:bg-red-400 focus:ring-red-600 focus:ring-offset-2 rounded-sm text-red-400 font-bold"
							onClick={loadMoreMessages}
						>
							Load More
						</button>
					)}
			</div>
			<div className="w-full p-2">
				{currentMessages["messages"] && (
					<input
						className="transition ease-in-out w-full bg-slate-200 rounded-sm p-2 hover:ring hover:ring-slate-300 focus:outline-none focus:ring focus:ring-red-300"
						type="text"
						name="message"
						value={message}
						placeholder="Type your message here..."
						onChange={(event) => {
							setMessage(event.target.value)
						}}
						onKeyDown={(event) => {
							event.key === "Enter" && send()
						}}
					/>
				)}
			</div>
		</div>
	)
}
