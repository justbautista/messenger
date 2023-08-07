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
			[chatId]: messages,
		}))
	}

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
