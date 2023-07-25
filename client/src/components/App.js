import { useState, useEffect } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"
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
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const checkIfLoggedIn = async () => {
			try {
				await api.post("/auth/isLoggedIn")
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
