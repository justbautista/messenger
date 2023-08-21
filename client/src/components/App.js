import LoaderPage from "./LoaderPage"
import HomePage from "./HomePage"
import LoginPage from "./LoginPage"
import SignUpPage from "./SignUpPage"
import NotFoundPage from "./NotFoundPage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import PrivateRoutes from "./PrivateRoutes"
import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"

export default function App() {
	const { authLoading, isLoggedIn } = useAuth()

	if (authLoading) {
		return (
			<div className="h-screen w-screen">
				<LoaderPage />
			</div>
		)
	}

	return (
		<div>
			<Router>
				<Routes>
					<Route element={<PrivateRoutes />}>
						<Route path="/" element={<HomePage />} />
					</Route>
					<Route
						path="/login"
						element={
							isLoggedIn ? <Navigate to="/" /> : <LoginPage />
						}
					/>
					<Route
						path="/signUp"
						element={
							isLoggedIn ? <Navigate to="/" /> : <SignUpPage />
						}
					/>
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</Router>
		</div>
	)
}
