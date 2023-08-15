import React, { useEffect, useState } from "react"
import api from "../helpers/axiosConfig"
import {
	generateAxiosError,
	removeAccessToken,
} from "../helpers/helpers"
import { useNavigate } from "react-router-dom"
import MessageBox from "./MessageBox"
import ChatList from "./ChatList"
import { SocketProvider } from "../contexts/SocketContext"
import { useAuth } from "../contexts/AuthContext"

export default function HomePage() {
    const { setIsLoggedIn, setUsername } = useAuth()
	const navigate = useNavigate()

	const logout = async (event) => {
		event.preventDefault()
		try {
			await api.post("/auth/logout")
            
			removeAccessToken()
            setUsername("")
			setIsLoggedIn(false)
			navigate("/login")
		} catch (err) {
			console.error(generateAxiosError(err))
		}
	}

	return (
		<SocketProvider>
			<div>
				<p>Home Page</p>
				<button type="button" onClick={logout}>
					Logout
				</button>
				<br />
				<ChatList />
				<MessageBox />
			</div>
		</SocketProvider>
	)
}
