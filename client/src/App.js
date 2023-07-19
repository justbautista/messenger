import io from "socket.io-client"
import { useState } from "react"

const socket = io(process.env.REACT_APP_BACKEND_URI, {
    auth: {
        token: "token"
    }
})

function App() {
    socket.on("connect_error", (error) => console.log(error));
	return (
		<div className="App">
			<h1 className="text-3xl font-bold underline">Hello world!</h1>
		</div>
	)
}

export default App
