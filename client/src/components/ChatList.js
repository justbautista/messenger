import React, { useState, useEffect } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"
import { useChat } from "../contexts/chatContext"
import Chat from "./Chat"

export default function ChatList({ socket }) {
    const [chatList, setChatList] = useState([])
    const { selectedChat, setSelectedChat } = useChat()

    useEffect(() => {
        const getChatList = async () => {
            try {
                const response = await api.get("/chats/list")
                setChatList(response.data["chatList"])
            } catch (err) {
                console.error(generateAxiosError(err))
            }
        }
        getChatList()

        socket.connect()
        socket.on("connect_error", (error) => console.error(error))

        return () => socket.disconnect()
    }, [])

    useEffect(() => {
        if (chatList.length > 0 && !selectedChat) {
            setSelectedChat(chatList[0]["chatId"])
        }
    }, [chatList])

    return (
        <div>
            {chatList.map((chat) => (
                <Chat 
                    key={ chat["chatId"] }
                    chat={ chat }
                />
            ))}
        </div>
    )
}