import React, { useRef, useEffect, useState } from "react"
import { useChat } from "../contexts/ChatContext"
import api from "../helpers/axiosConfig"
import { generateAxiosError } from "../helpers/helpers"
import { useAuth } from "../contexts/AuthContext"

export default function NewChatModal({ setChatList }) {
	const { username } = useAuth()
	const { setShowNewChatModal } = useChat()
	const modalRef = useRef(null)
	const userListDropdownRef = useRef(null)
	const [userList, setUserList] = useState([])
	const [addedUserList, setAddedUserList] = useState([])
	const [chatName, setChatName] = useState("")
	const [userInput, setUserInput] = useState("")

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				setShowNewChatModal(false)
			}
		}

		document.addEventListener("mousedown", handleOutsideClick)

		return () =>
			document.removeEventListener("mousedown", handleOutsideClick)
	}, [])

	useEffect(() => {
		const searchUsers = async () => {
			try {
				const response = await api.get("/users/search", {
					params: { user: userInput },
				})

				const excludeUserList = [...addedUserList, username]

				const usersExceptTheseUsers = response.data["users"].filter(
					(user) => !excludeUserList.includes(user)
				)

				setUserList(usersExceptTheseUsers)
			} catch (err) {
				setUserList([])
				console.error(generateAxiosError(err))
			}
		}

		searchUsers()
	}, [userInput])

	const createChat = async () => {
        try {
            if (addedUserList.length === 0) {
                return
            }

            const memberList = [...addedUserList, username]
    
            const response = await api.post("/chats", {
                members: memberList,
                chatName: chatName,
            })
            
            const newChat = {
                chatName: chatName.trim() !== "" ? chatName : memberList.join(", "),
                chatId: response.data["roomId"],
                read: false,
                updatedAt: new Date().toISOString(),
                latestMessage: false
            }

            setChatList(prev => [newChat, ...prev])
            setShowNewChatModal(false)
        } catch (err) {
            console.error(generateAxiosError(err))
        }
	}

	const addUserToList = (userToAdd) => {
        setUserInput("")
		setAddedUserList((prev) => [...prev, userToAdd])
	}

	const removeAddedUser = (removeUser) => {
		const listWithoutUser = addedUserList.filter(
			(user) => user !== removeUser
		)
		setAddedUserList(listWithoutUser)
	}

	return (
		<div className="fixed top-0 left-0 h-full w-full z-20 flex items-center justify-center bg-black bg-opacity-80">
			<div
				className="p-10 bg-white rounded-xl flex flex-col items-center"
				ref={modalRef}
			>
				<h1 className="text-3xl font-bold mb-10">New Chat</h1>
				<div className="flex flex-col mb-2">
					<label
						className="text-sm font-semibold mb-1 text-left"
						htmlFor="chatName"
					>
						Chat Name
					</label>
					<input
						className="transition ease-in-out bg-slate-200 w-64 rounded-sm p-1 hover:ring hover:ring-slate-300 focus:outline-none focus:ring focus:ring-red-300"
						type="text"
						name="chatName"
						value={chatName}
						onChange={(event) => {
							setChatName(event.target.value)
						}}
					/>
				</div>
				<div className="relative flex flex-col mb-2">
					<label
						className="text-sm font-semibold mb-1 text-left"
						htmlFor="userInput"
					>
						Add Users
					</label>
					<input
						className="transition ease-in-out bg-slate-200 w-64 rounded-sm p-1 hover:ring hover:ring-slate-300 focus:outline-none focus:ring focus:ring-red-300"
						type="text"
						name="userInput"
						value={userInput}
						onChange={(event) => {
							setUserInput(event.target.value)
						}}
					/>
					{userList.length > 0 && (
						<div
							className="overflow-y-auto ring-black ring-1 ring-opacity-5 max-h-48 w-64 absolute top-full left-0 mt-2 z-10 origin-top-right p-2 rounded-md shadow-lg bg-white"
							ref={userListDropdownRef}
						>
							{userList.map((user) => (
								<button
									className="p-2 my-1 w-full text-left rounded-md hover:bg-slate-200 font-semibold"
									onClick={() => addUserToList(user)}
								>
									{user}
								</button>
							))}
						</div>
					)}
				</div>
				{addedUserList.length > 0 && (
					<div className="flex flex-col w-64 divide-y divide-solid rounded-xl border-2 border-solid border-slate-200 px-2">
						{addedUserList.map((user) => (
							<div className="py-2 font-semibold flex flex-row justify-between items-center">
								<p>{user}</p>
								<button onClick={() => removeAddedUser(user)}>
									<svg
										class="h-6 w-6 text-red-500"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										{" "}
										<rect
											x="3"
											y="3"
											width="18"
											height="18"
											rx="2"
											ry="2"
										/>{" "}
										<line x1="9" y1="9" x2="15" y2="15" />{" "}
										<line x1="15" y1="9" x2="9" y2="15" />
									</svg>
								</button>
							</div>
						))}
					</div>
				)}
				<button className="transition ease-in-out bg-red-400 my-2 p-2 hover:bg-white hover:ring hover:ring-red-400 hover:text-red-400 focus:ring focus:ring-red-600 focus:ring-offset-2 rounded-sm text-white font-bold" onClick={createChat}>
					Create Chat
				</button>
			</div>
		</div>
	)
}
