import React, { createContext, useContext, useState, useEffect } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"

const AuthContext = createContext()

export function useAuth() {
	return useContext(AuthContext)
}

export function AuthProvider({ children }) {
	const [username, setUsername] = useState("")
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [authLoading, setAuthLoading] = useState(true)

	useEffect(() => {
		const checkIfLoggedIn = async () => {
			try {
				const response = await api.post("/auth/isLoggedIn")
				setUsername(response.data["username"])
				setIsLoggedIn(true)
			} catch (err) {
				console.error(generateAxiosError(err))
				setIsLoggedIn(false)
			} finally {
				setAuthLoading(false)
			}
		}

		checkIfLoggedIn()
	}, [])

	return (
		<AuthContext.Provider
			value={{
				username,
				setUsername,
				authLoading,
				isLoggedIn,
				setIsLoggedIn,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
