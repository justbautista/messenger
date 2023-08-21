import React, { useState } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function SignUpPage() {
	const { setIsLoggedIn, username, setUsername } = useAuth()
	const [password, setPassword] = useState("")
	const [signUpError, setSignUpError] = useState()
	const navigate = useNavigate()

	const handleSubmit = async (event) => {
		event.preventDefault()
		try {
			if (password === "" || username === "") {
				setSignUpError("Please enter a username and a password")
				return
			}

			await api.post("/auth/signUp", {
				username: username,
				password: password,
			})

			setPassword("")
			setIsLoggedIn(true)
			navigate("/")
		} catch (err) {
			setSignUpError(err.response.data["message"])
			console.error(generateAxiosError(err))
		}
	}

	return (
		<div className="h-screen flex justify-center items-center">
			<form
				className="p-10 border-2 border-solid border-slate-200 rounded-xl"
				onSubmit={handleSubmit}
			>
				<h1 className="text-center text-3xl font-bold mb-10">
					Sign Up
				</h1>
				<div className="flex flex-col mb-2">
					{signUpError && (
						<p className="w-64 mb-2 text-sm text-red-600 p-2 rounded-sm bg-red-200 ring ring-red-600">
							{signUpError}
						</p>
					)}
					<label
						className="text-sm font-semibold mb-1"
						htmlFor="username"
					>
						Username
					</label>
					<input
						className="transition ease-in-out bg-slate-200 w-64 rounded-sm p-1 hover:ring hover:ring-slate-300 focus:outline-none focus:ring focus:ring-red-300"
						type="text"
						name="username"
						value={username}
						onChange={(event) => {
							setUsername(event.target.value)
						}}
					/>
				</div>
				<div className="flex flex-col mb-5">
					<label
						className="text-sm font-semibold mb-1"
						htmlFor="password"
					>
						Password
					</label>
					<input
						className="transition ease-in-out bg-slate-200 w-64 rounded-sm p-1 hover:ring hover:ring-slate-300 focus:outline-none focus:ring focus:ring-red-300"
						type="password"
						name="password"
						value={password}
						onChange={(event) => {
							setPassword(event.target.value)
						}}
					/>
				</div>
				<div className="flex flex-col divide-y divide-solid">
					<button
						className="transition ease-in-out bg-red-400 my-2 p-2 hover:bg-white hover:ring hover:ring-red-400 hover:text-red-400 focus:ring focus:ring-red-600 focus:ring-offset-2 rounded-sm text-white font-bold"
						type="submit"
					>
						Sign Up
					</button>
					<Link
						className="w-full text-center py-2 text-sm underline hover:no-underline focus:text-red-600 visited:text-red-600"
						to="/login"
					>
						Login Here
					</Link>
				</div>
			</form>
		</div>
	)
}
