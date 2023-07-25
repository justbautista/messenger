import React, { useState } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"

export default function Login() {
    // register and login will be same style page, probably put display name into register
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            await api.post("/auth/login", { username: username, password: password }) 
        } catch (err) {
            console.error(generateAxiosError(err))
        }
    }

    const logout = async (event) => {
        event.preventDefault()
        try {
            await api.post("/auth/logout")
        } catch (err) {
            console.error(generateAxiosError(err))
        }
    }

    // TODO: finish login screen and loader screen doesnt seem to work properly

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
                    <p>Register here</p>
                </div>
            </form>
            <button type="button" onClick={logout}>Log Out</button>
		</div>
	)
}
