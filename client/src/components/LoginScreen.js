import React, { useState } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError, setAccessToken } from "../helpers/helpers"

export default function Login() {
    // register and login will be same style page, probably put display name into register
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const response = await api.post("/auth/login", { username: username, password: password })
            setAccessToken(response.headers["Authorization"])
        } catch (err) {
            console.error(generateAxiosError(err))
        }
    }

	return (
		<div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" value={ username } onChange={(event) => {
                        setUsername(event.target.value)
                    }} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" value={ password } onChange={(event) => {
                        setPassword(event.target.value)
                    }} />
                </div>
                <div>
                    <button type="submit">Login</button>
                    <a>Register here</a>
                </div>
            </form>
		</div>
	)
}
