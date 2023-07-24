import io from "socket.io-client"
import { useState, useEffect } from "react"
import api from "../helpers/axiosConfig"
import {
	setAccessToken,
	getAccessToken,
	generateAxiosError,
} from "../helpers/helpers"
import LoaderScreen from "./LoaderScreen"
import HomeScreen from "./HomeScreen"
import LoginScreen from "./LoginScreen"

// const socket = io(process.env.REACT_APP_BACKEND_URI, {
//     auth: {
//         token: "token"
//     }
// })
// socket.on("connect_error", (error) => console.log(error));

export default function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const checkIfLoggedIn = async () => {
			try {
				api.defaults.headers.common["Authorization"] = getAccessToken()
				const response = await api.post("/auth/isLoggedIn")
                
                if (response.headers["authorization"]) {
                    setAccessToken(response.headers["authorization"])
                }
                
				setIsLoggedIn(true)
			} catch (err) {
				console.error(generateAxiosError(err))
				setIsLoggedIn(false)
			} finally {
				setLoading(false)
			}
		}

		checkIfLoggedIn()
	}, [])

	return (
		<div className="App">
			{loading ? (
				<LoaderScreen />
			) : isLoggedIn ? (
				<HomeScreen />
			) : (
				<LoginScreen />
			)}
		</div>
	)
}
