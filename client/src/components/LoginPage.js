import React, { useState } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"
import { Link, useNavigate } from "react-router-dom"

export default function LoginPage({ setIsLoggedIn }) {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const navigate = useNavigate()

	const handleSubmit = async (event) => {
		event.preventDefault()
		try {
			await api.post("/auth/login", {
				username: username,
				password: password,
			})
            setPassword("")
			setIsLoggedIn(true)
			navigate("/")
		} catch (err) {
			console.error(generateAxiosError(err))
		}
	}

	return (
		<div>
			<form onSubmit={ handleSubmit }>
				<h1>Login</h1>
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
					<button type="submit">Login</button>
					<Link to="/register">Register Here</Link>
				</div>
			</form>
		</div>
	)
}
