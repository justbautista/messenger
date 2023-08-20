import React, { useEffect, useState, useRef } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError, removeAccessToken } from "../helpers/helpers"
import { useNavigate } from "react-router-dom"
import MessageBox from "./MessageBox"
import ChatList from "./ChatList"
import { SocketProvider } from "../contexts/SocketContext"
import { useAuth } from "../contexts/AuthContext"
import NewChatModal from "./NewChatModal"
import { useChat } from "../contexts/ChatContext"

export default function HomePage() {
	const { setIsLoggedIn, setUsername, username } = useAuth()
    const { showNewChatModal } = useChat()
	const [toggle, setToggle] = useState(false)
	const userButtonRef = useRef(null)
	const userDropdownRef = useRef(null)
	const navigate = useNavigate()

	const logout = async (event) => {
		event.preventDefault()
		try {
			await api.post("/auth/logout")

			removeAccessToken()
			setUsername("")
			setIsLoggedIn(false)
			navigate("/login")
		} catch (err) {
			console.error(generateAxiosError(err))
		}
	}

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (
				userButtonRef.current &&
				userDropdownRef.current &&
				!userButtonRef.current.contains(event.target) &&
				!userDropdownRef.current.contains(event.target)
			) {
				setToggle(false)
			}
		}

		document.addEventListener("mousedown", handleOutsideClick)

		return () =>
			document.removeEventListener("mousedown", handleOutsideClick)
	}, [])

	return (
		<SocketProvider>
			<div className="h-screen flex flex-col">
                {showNewChatModal && <NewChatModal />}
				<div className="flex flex-row justify-between my-2 mx-4 items-center">
					<h1 className="font-bold text-3xl">Messenger</h1>
					<div className="relative inline-block text-left">
						<button
							className="transition ease-in-out p-3 rounded-md hover:bg-slate-200 focus:bg-red-400 focus:text-white focus:ring focus:ring-red-600"
							ref={userButtonRef}
							onClick={() => setToggle(!toggle)}
						>
							{username}
						</button>
						{toggle && (
							<div
								className="ring-black ring-1 ring-opacity-5 absolute right-0 mt-2 z-10 origin-top-right p-2 rounded-md shadow-lg bg-white"
								ref={userDropdownRef}
							>
								<button
									className="transition ease-in-out flex flex-row items-center gap-1 p-2 text-red-400 hover:bg-red-400 hover:text-white rounded-md"
									onClick={logout}
								>
									Logout
									<svg
										className="h-5 w-5"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										fill="none"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										{" "}
										<path
											stroke="none"
											d="M0 0h24v24H0z"
										/>{" "}
										<path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />{" "}
										<path d="M7 12h14l-3 -3m0 6l3 -3" />
									</svg>
								</button>
							</div>
						)}
					</div>
				</div>
				<div className="grow overflow-y-hidden grid grid-cols-3 divide-x border m-2 rounded-xl">
					<ChatList />
					<MessageBox />
				</div>
			</div>
		</SocketProvider>
	)
}
