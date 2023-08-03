import React, { useEffect, useState } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError, getAccessToken, removeAccessToken } from "../helpers/helpers"
import { useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import MessageBox from "./MessageBox"
import ChatList from "./ChatList"

const socket = io(process.env.REACT_APP_SOCKET_URI, {
    auth: {
        token: getAccessToken()
    },
    autoConnect: false
})

export default function HomePage({ setIsLoggedIn }) {
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
            <br />
            <ChatList socket={socket}/>
            <MessageBox />
		</>
	)
}
