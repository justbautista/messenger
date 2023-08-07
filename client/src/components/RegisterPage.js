import React, { useState } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function RegisterPage() {
    const { setIsLoggedIn } = useAuth()
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const navigate = useNavigate()

	const handleSubmit = async (event) => {
		event.preventDefault()
		try {
			await api.post("/auth/register", {
				username: username,
				password: password,
			})
			setIsLoggedIn(true)
			navigate("/")
		} catch (err) {
			console.error(generateAxiosError(err))
		}
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<h1>Register</h1>
				<div>
					<label htmlFor="username">Username</label>
					<input
						type="text"
						name="username"
						value={username}
						onChange={(event) => {
							setUsername(event.target.value)
						}}
					/>
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						value={password}
						onChange={(event) => {
							setPassword(event.target.value)
						}}
					/>
				</div>
				<div>
					<button type="submit">Register</button>
					<Link to="/login">Login Here</Link>
				</div>
			</form>
		</div>
	)
}
