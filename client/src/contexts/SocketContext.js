import React, { createContext, useContext, useState, useEffect } from "react"
import { io } from "socket.io-client"
import { getAccessToken } from "../helpers/helpers"

const SocketContext = createContext()

export function useSocket() {
	return useContext(SocketContext)
}

export function SocketProvider({ children }) {
	const [socket, setSocket] = useState()

	// init socket
	useEffect(() => {
		const newSocket = io(process.env.REACT_APP_SOCKET_URI, {
			auth: {
				token: getAccessToken(),
			},
		})

		setSocket(newSocket)

		return () => newSocket.disconnect()
	}, [])

	// emitters
	const sendMessage = (messageData) => {
        if (socket && socket.connected) {
            socket.emit("send-message", messageData, (response) => {
                if (response.ok) {
                    console.log(response)
                } else {
                    console.error(response)
                }
            })	
        }
	}

	const joinRoom = (room) => {
		if (socket && socket.connected) {
			socket.emit("join-room", room, (response) => {
				if (response.ok) {
                    console.log(response)
                } else {
                    console.error(response)
                }
			})
		}
	}

    const leaveRoom = (room) => {
        if (socket && socket.connected) {
			socket.emit("leave-room", room, (response) => {
				if (response.ok) {
                    console.log(response)
                } else {
                    console.error(response)
                }
			})
		}
    }

    const read = (readData) => {
        if (socket && socket.connected) {
            socket.emit("read", readData, (response) => {
                if (response.ok) {
                    console.log(response)
                } else {
                    console.error(response)
                }
            })
        }
    }

	return (
		<SocketContext.Provider
			value={{ socket, sendMessage, joinRoom, leaveRoom, read }}
		>
			{children}
		</SocketContext.Provider>
	)
}

export default SocketContext
