import { createContext, useContext, useState } from "react"

const ChatContext = createContext()

export function useChat() {
	return useContext(ChatContext)
}

export function ChatProvider({ children }) {
	const [selectedChat, setSelectedChat] = useState()
	const [messageStore, setMessageStore] = useState({})

	const addToMessageStore = (chatId, messages) => {
		setMessageStore((prev) => ({
			...prev,
			[chatId]: { messages: messages },
		}))
	}


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
				addToMessageStore,
			}}
		>
			{children}
		</ChatContext.Provider>
	)
}

export default ChatContext
