const formatChatList = (chatList, rooms) => {
	const formattedChatList = chatList
		.map((chat) => {
			chat["messages"].sort(
				(a, b) => b["timeStamp"].getTime() - a["timeStamp"].getTime()
			)

			const readStatus = rooms.find(
				(room) => room["room"].toString() === chat["_id"].toString()
			)["read"]

			const latestMessage = chat["messages"][0]
				? {
						senderUsername: chat["messages"][0]["senderUsername"],
						timeStamp: chat["messages"][0]["timeStamp"],
						message: chat["messages"][0]["message"],
				  }
				: false

			const formattedChat = {
				chatName: chat["chatName"],
				chatId: chat["_id"].toString(),
				read: readStatus,
				updatedAt: chat["updatedAt"],
				latestMessage: latestMessage,
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
	console.log("msgsLoaded: ", msgsLoaded)
	const messageLimit = 50
	let allMessagesLoaded = false
	let placeOfLastMessageToLoad = msgsLoaded + messageLimit
	console.log("place: ", placeOfLastMessageToLoad)
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
