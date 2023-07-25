import { useState, useEffect } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"
import LoaderPage from "./LoaderPage"
import HomePage from "./HomePage"
import LoginPage from "./LoginPage"
import RegisterPage from "./RegisterPage"
import NotFoundPage from "./NotFoundPage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import PrivateRoutes from "./PrivateRoutes"

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

	if (loading) {
		return <LoaderPage />
	}

	return (
		<div className="App">
			<Router>
				<Routes>
					<Route element={<PrivateRoutes isLoggedIn={isLoggedIn} />}>
						<Route path="/" element={<HomePage />} />
					</Route>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</Router>
		</div>
	)
}
