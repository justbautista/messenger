import React from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError, removeAccessToken } from "../helpers/helpers"
import { useNavigate } from "react-router-dom"
import io from "socket.io-client"

// const socket = io(process.env.REACT_APP_BACKEND_URI, {
//     auth: {
//         token: "token"
//     }
// })
// socket.on("connect_error", (error) => console.log(error))

export default function HomePage() {
	const navigate = useNavigate()

	const logout = async (event) => {
		event.preventDefault()
		try {
			await api.post("/auth/logout")
			removeAccessToken()
			navigate("/login")
		} catch (err) {
			console.error(generateAxiosError(err))
		}
	}

	return (
		<>
			<p>Home Page</p>
			<button type="button" onClick={logout}>
				Logout
			</button>
		</>
	)
}
