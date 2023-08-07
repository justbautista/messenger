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
import { useAuth } from "../contexts/AuthContext"

export default function App() {
    const { authLoading } = useAuth()

	if (authLoading) {
		return <LoaderPage />
	}

	return (
		<div className="App">
			<Router>
				<Routes>  
                    <Route element={<PrivateRoutes />}>
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
