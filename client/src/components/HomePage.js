import React, { useEffect, useState, useRef } from "react"
import api from "../helpers/axiosConfig"
import { generateAxiosError, removeAccessToken } from "../helpers/helpers"
import { useNavigate } from "react-router-dom"
import MessageBox from "./MessageBox"
import ChatList from "./ChatList"
import { SocketProvider } from "../contexts/SocketContext"
import { useAuth } from "../contexts/AuthContext"
import { useChat } from "../contexts/ChatContext"

export default function HomePage() {
	const { setIsLoggedIn, setUsername, username } = useAuth()
	const { setMessageStore } = useChat()
	const [toggle, setToggle] = useState(false)
	const [toggleChatList, setToggleChatList] = useState() // if responsiveness is on, toggle chatList
	const [responsiveChatList, setResponsiveChatList] = useState(false) // turn responsive chatList on/off
	const userButtonRef = useRef(null)
	const userDropdownRef = useRef(null)
	const navigate = useNavigate()
	const WIDTH_TO_TRIGGER_SLIDING_CHATLIST = 640

	const logout = async (event) => {
		event.preventDefault()
		try {
			await api.post("/auth/logout")

			removeAccessToken()
			setUsername("")
			setIsLoggedIn(false)
			setMessageStore([])
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

		const handleResize = () => {
			if (
				window.innerWidth <= WIDTH_TO_TRIGGER_SLIDING_CHATLIST &&
				!responsiveChatList
			) {
				setResponsiveChatList(true)
			} else if (
				window.innerWidth > WIDTH_TO_TRIGGER_SLIDING_CHATLIST &&
				responsiveChatList
			) {
				setResponsiveChatList(false)
			}
		}

		if (
			window.innerWidth <= WIDTH_TO_TRIGGER_SLIDING_CHATLIST &&
			!responsiveChatList
		) {
			setResponsiveChatList(true)
		}

		document.addEventListener("mousedown", handleOutsideClick)
		window.addEventListener("resize", handleResize)

		return () => {
			document.removeEventListener("mousedown", handleOutsideClick)
			window.removeEventListener("resize", handleResize)
		}
	}, [responsiveChatList])

	return (
		<SocketProvider>
			<div className="h-screen flex flex-col">
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
										strokeWidth="2"
										stroke="currentColor"
										fill="none"
										strokeLinecap="round"
										strokeLinejoin="round"
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
				<div className="grow relative overflow-hidden grid grid-cols-3 xl:grid-cols-4 divide-x border m-2 rounded-xl">
					<ChatList
						responsiveChatList={responsiveChatList}
						toggleChatList={toggleChatList}
						setToggleChatList={setToggleChatList}
					/>
					<MessageBox
						responsiveChatList={responsiveChatList}
						setToggleChatList={setToggleChatList}
					/>
				</div>
			</div>
		</SocketProvider>
	)
}
