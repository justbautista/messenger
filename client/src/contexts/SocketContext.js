import React, { createContext, useContext, useState, useEffect } from "react"
import { io } from "socket.io-client"
import { getAccessToken } from "../helpers/helpers"

const SocketContext = createContext()

export function useSocket() {
	return useContext(SocketContext)
}

export function SocketProvider({ children }) {
	const [receivedMessage, setReceivedMessage] = useState({})
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

    // listeners
	useEffect(() => {
        if (socket && socket.connected) {
            socket.on("receive-message", (receivedMessageData) => {
                setReceivedMessage(receivedMessageData)
            })
        }
	}, [socket])

    // emitters
    const sendMessage = (messageData) => {
        if (socket && socket.connected) {
            socket.emit("send-message", messageData)
        }
	}

	const joinRoom = (room) => {
        if (socket && socket.connected) {
            socket.emit("join-room", room)
        }
	}

	return (
		<SocketContext.Provider
			value={{ sendMessage, joinRoom, receivedMessage }}
		>
			{children}
		</SocketContext.Provider>
	)
}

export default SocketContext
