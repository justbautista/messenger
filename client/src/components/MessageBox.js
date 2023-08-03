import React, { useState, useEffect } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"
import { useChat } from "../contexts/chatContext"

export default function MessageBox() {
	const { selectedChat, messageStore, updateMessageStore } = useChat()
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
                    updateMessageStore(selectedChat, currentMessages["messages"])
                }

				// if no chat in message store, fetch it and add to message store
				if (!messageStore[selectedChat]) {
					const response = await api.get(
						`/chats/${selectedChat}/messages`,
						{ params: { msgsLoaded: 0 } }
					)

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

    // saves to messageStore when chat changes
    // selectedChat > messageStore  
    // 

	// const loadMoreMessages = async (chatId) => {
	// 	const chat = findChat(chatId)

	// 	// TODO: have a check for if allmessagesareloaded for the messagebox, this only works for the messageStore
	// 	if (chat["messages"]["allMessagesLoaded"]) {
	// 		return
	// 	}

	// 	const response = await api.get(`/chats/${selectedChat}/messages`, {
	// 		params: { msgsLoaded: chat["messages"]["totalMessagesLoaded"] },
	// 	})

	// 	addToMessageBox(
	// 		chatId,
	// 		response.data["messages"]["messages"],
	// 		response.data["messages"]["totalMessagesLoaded"]
	// 	)
	// }

	// TODO: display messages, have a conditional rendering load more messages button, implement new state for messagebox
	return (
		<div>
			{currentMessages["messages"] ? (
                <div>
                    <p>{currentMessages["chatId"]}</p>
                    <p>{currentMessages["messages"]["allMessagesLoaded"]}</p>
                    <p>{currentMessages["messages"]["totalMessagesLoaded"]}</p>
                </div>
			) : (
				<p>Loading messages</p>
			)}
		</div>
	)
}
