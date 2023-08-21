import { createContext, useContext, useState } from "react"

const ChatContext = createContext()

export function useChat() {
	return useContext(ChatContext)
}

export function ChatProvider({ children }) {
	const [selectedChat, setSelectedChat] = useState()
	const [messageStore, setMessageStore] = useState([])
	const [sessionReadTracker, setSessionReadTracker] = useState({})
	const [sentMessage, setSentMessage] = useState({})
    const [showNewChatModal, setShowNewChatModal] = useState(false)

	// only run when changing selectedChat
	const updateMessageStore = (chatId, messages, chatName) => {
		setMessageStore((prev) => ({
			...prev,
			[chatId]: {
				messages: messages,
				chatName: chatName,
			},
		}))
	}

	return (
		<ChatContext.Provider
			value={{
				selectedChat,
				setSelectedChat,
				messageStore,
                setMessageStore,
				updateMessageStore,
				sessionReadTracker,
				setSessionReadTracker,
				sentMessage,
				setSentMessage,
                showNewChatModal,
                setShowNewChatModal
			}}
		>
			{children}
		</ChatContext.Provider>
	)
}

export default ChatContext
