import { createContext, useContext, useState } from "react"

const ChatContext = createContext()

export function useChat() {
	return useContext(ChatContext)
}

export function ChatProvider({ children }) {
	const [selectedChat, setSelectedChat] = useState()
	const [messageStore, setMessageStore] = useState([])

	const updateMessageStore = (chatId, messages) => {
		setMessageStore((prev) => ({
            ...prev,
            [chatId]: messages
        }))
	}

	// const findChat = (chatId) => {
	// 	return messageStore.find((chat) => chat["chatId"] === chatId)
	// }

    // const addToMessageBox = (chatId, messagesToAdd, totalMessagesLoaded) => {
    //     const chatIndex = messageStore.findIndex(chat => chat["chatId"] === chatId)

    //     if (chatIndex !== -1) {
    //         let updatedMessageStore = [ ...messageStore ]
    //         updatedMessageStore[chatIndex]["messages"]["messages"].push(messagesToAdd)
    //         updatedMessageStore[chatIndex]["messages"]["totalMessagesLoaded"] = totalMessagesLoaded
    //         setMessageStore(updatedMessageStore)
    //     }
    // }

	// load chat messages in the message screen, save from the message screen
	// chatlist components will only hold the chatid and stuff, so once selected the message screen useeffect will be triggered
	// when triggered it calls the api and pulls in the messages from a specific chat and saves it in an object, indexed by chatId or chatname
	// from the message screen

	return (
		<ChatContext.Provider
			value={{
				selectedChat,
				setSelectedChat,
				messageStore,
				updateMessageStore,
			}}
		>
			{children}
		</ChatContext.Provider>
	)
}

export default ChatContext
