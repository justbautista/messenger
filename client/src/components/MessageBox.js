import React, { useState, useEffect } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"
import { useChat } from "../contexts/chatContext"

export default function MessageBox() {
	const {
		selectedChat,
		messageStore,
		addToMessageStore,
		findChat,
		addToMessageBox,
	} = useChat()
    const [currentMessages, setCurrentMessages] = useState({})

    /*
        currentMessages
        {
            chatId: chatId,
            messages: messagesObject
        }

        messageStore
        {
            chatId: {
                messagesObject: messagesObject
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

				const chat = findChat(selectedChat)

                // if no chat in message store, fetch it and add to message store
				if (!chat) {
					const response = await api.get(
						`/chats/${selectedChat}/messages`,
						{ params: { msgsLoaded: 0 } }
					)

					addToMessageStore(selectedChat, response.data["messages"])
                    return
				}

                // if there is a chat, fetch from message store
                console.log(chat)
			} catch (err) {
				console.error(generateAxiosError(err))
			}
		}

		getMessages()
	}, [selectedChat, messageStore])

	const loadMoreMessages = async (chatId) => {
		const chat = findChat(chatId)
        
        // TODO: have a check for if allmessagesareloaded for the messagebox, this only works for the messageStore
		if (chat["messages"]["allMessagesLoaded"]) {
			return
		}

		const response = await api.get(`/chats/${selectedChat}/messages`, {
			params: { msgsLoaded: chat["messages"]["totalMessagesLoaded"] },
		})

		addToMessageBox(
			chatId,
			response.data["messages"]["messages"],
			response.data["messages"]["totalMessagesLoaded"]
		)
	}

    // TODO: display messages, have a conditional rendering load more messages button, implement new state for messagebox
	return (
		<div>
			{messageStore.length > 0 ? (
				messageStore.map((chat) => (
					<div key={chat["chatId"]}>
						<p>---------------</p>
						<p>{chat["chatId"]}</p>
						<p>---------------</p>
					</div>
				))
			) : (
				<div>Nothing in store</div>
			)}
		</div>
	)
}
