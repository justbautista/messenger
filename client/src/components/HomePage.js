import React, { useEffect, useState } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError, getAccessToken, removeAccessToken } from "../helpers/helpers"
import { useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import Chat from "./Chat"
import MessageBox from "./MessageBox"

const socket = io(process.env.REACT_APP_SOCKET_URI, {
    auth: {
        token: getAccessToken()
    },
    autoConnect: false
})

export default function HomePage({ setIsLoggedIn }) {
    const [chatList, setChatList] = useState([])
	const navigate = useNavigate()

	const logout = async (event) => {
		event.preventDefault()
		try {
			await api.post("/auth/logout")
			removeAccessToken()
            setIsLoggedIn(false)
			navigate("/login")
		} catch (err) {
			console.error(generateAxiosError(err))
		}
	}

    useEffect(() => {
        const getChatList = async () => {
            const response = await api.get("/chats/list")
            setChatList(response.data["chatList"])
        }
        getChatList()

        socket.connect()
        socket.on("connect_error", (error) => console.error(error))

        return () => socket.disconnect()
    }, [])

    // const test = () => {
    //     socket.emit("test", "ioaiashd")
    // }

    // TODO: start working on displaying chat list and doing the structure shown in chatContext

	return (
		<>
			<p>Home Page</p>
			<button type="button" onClick={ logout }>
				Logout
			</button>
            
            {chatList.map((chat) => (
                <Chat 
                    key={ chat["chatId"] }
                    chat={ chat }
                />
            ))}
            <br />
            <MessageBox />
		</>
	)
}
