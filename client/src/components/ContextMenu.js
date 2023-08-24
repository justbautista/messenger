import React, { useRef, useEffect } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"
import { useSocket } from "../contexts/SocketContext"

export default function ContextMenu({
	x,
	y,
	chat,
	setChatList,
	chatList,
	setContextMenuPosition,
}) {
	const menu = useRef(null)
	const { leaveRoom } = useSocket()

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (menu.current && !menu.current.contains(event.target)) {
				setContextMenuPosition(null)
			}
		}

		document.addEventListener("mousedown", handleOutsideClick)

		return () =>
			document.removeEventListener("mousedown", handleOutsideClick)
	}, [])

	const deleteChat = async () => {
		try {
			const removedChat = chatList.filter(
				(chatInList) => chatInList["chatId"] !== chat["chatId"]
			)

			await api.delete(`/chats/${chat["chatId"]}`)
			leaveRoom(chat["chatId"])
			setContextMenuPosition(null)
			setChatList(removedChat)
		} catch (err) {
			console.error(generateAxiosError(err))
		}
	}

	return (
		<div
			className="ring-black ring-1 absolute ring-opacity-5 mt-2 z-10 p-2 rounded-md shadow-lg bg-white"
			style={{ left: x, top: y }}
			ref={menu}
		>
			<button
				className="transition ease-in-out flex flex-row items-center gap-1 p-2 text-red-400 hover:bg-red-400 hover:text-white rounded-md"
				onClick={deleteChat}
			>
				Delete
				<svg
					className="h-6 w-6"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					strokeWidth="2"
					stroke="currentColor"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					{" "}
					<path stroke="none" d="M0 0h24v24H0z" />{" "}
					<line x1="4" y1="7" x2="20" y2="7" />{" "}
					<line x1="10" y1="11" x2="10" y2="17" />{" "}
					<line x1="14" y1="11" x2="14" y2="17" />{" "}
					<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />{" "}
					<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
				</svg>
			</button>
		</div>
	)
}
