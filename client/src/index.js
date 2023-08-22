import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./components/App"
import { ChatProvider } from "contexts/ChatContext"
import { AuthProvider } from "contexts/AuthContext"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
	<React.StrictMode>
		<AuthProvider>
			<ChatProvider>
				<App />
			</ChatProvider>
		</AuthProvider>
	</React.StrictMode>
)
