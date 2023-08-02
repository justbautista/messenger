import React, { useState, useEffect } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"
import { useChat } from "../contexts/chatContext"

export default function MessageBox() {
	const { selectedChat, messageStore, addToMessageStore } = useChat()
    const [test, setTest] = useState([])

	useEffect(() => {
		const getMessages = async () => {
			try {
                if (!selectedChat) {
                    return
                }

                if (!messageStore[selectedChat]) {
                    const response = await api.get(
                        `/chats/${selectedChat}/messages`,
                        { params: { msgsLoaded: 0 } }
                    )
                    // msgsLoaded will use a variable for when user clicks "LOAD MORE MESSAGES"

                    addToMessageStore(selectedChat, response.data["messages"])
                }

                setTest(Object.entries(messageStore))
			} catch (err) {
				console.error(generateAxiosError(err))
			}
		}

		getMessages()
	}, [selectedChat, messageStore])

	return (
        <div>
            {
                test.map(([key, value]) => (
                    <div>
                        <p>---------------</p>
                        <p>{ key }</p>
                        <p>---------------</p>
                    </div>

                ))
            }
        </div>
    )
}
