import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./components/App"
import { ChatProvider } from "./contexts/chatContext"


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
	<React.StrictMode>
        <ChatProvider>
		    <App />
        </ChatProvider>
	</React.StrictMode>
)
