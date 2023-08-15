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
import { Navigate } from "react-router-dom"

export default function App() {
    const { authLoading, isLoggedIn } = useAuth()

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
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
                    <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <RegisterPage />} />
                    <Route path="*" element={<NotFoundPage />} />
				</Routes>
			</Router>
		</div>
	)
}
