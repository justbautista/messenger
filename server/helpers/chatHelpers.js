const formatChatList = (chatList) => {
	const formattedChatList = chatList
		.map((chat) => {
			chat["messages"].sort(
				(a, b) => b["timeStamp"].getTime() - a["timeStamp"].getTime()
			)

			const formattedChat = {
				chatName: chat["chatName"],
				chatId: chat["_id"].toString(),
				updatedAt: chat["updatedAt"],
				latestMessage: chat["messages"][0],
			}

			return formattedChat
		})
		.sort((a, b) => b["updatedAt"].getTime() - a["updatedAt"].getTime())

	return formattedChatList
}

const loadMessages = (messages, msgsLoaded) => {
	const totalMessages = messages.length
	const sortedMessages = messages.sort(
		(a, b) => b["timeStamp"].getTime() - a["timeStamp"].getTime()
	)
	const messageLimit = 50
	let allMessagesLoaded = false
	let placeOfLastMessageToLoad = msgsLoaded + messageLimit

	if (totalMessages - msgsLoaded <= messageLimit) {
		allMessagesLoaded = true
		placeOfLastMessageToLoad = totalMessages
	}
	const batchOfMessages = sortedMessages.slice(
		msgsLoaded,
		placeOfLastMessageToLoad
	)

	const response = {
		messages: batchOfMessages,
		allMessagesLoaded: allMessagesLoaded,
		totalMessagesLoaded: placeOfLastMessageToLoad,
	}

	return response
}

module.exports = { formatChatList, loadMessages }
