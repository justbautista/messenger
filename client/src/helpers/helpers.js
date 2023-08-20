const getAccessToken = () => {
	return localStorage.getItem("access_token")
}

const setAccessToken = (accessToken) => {
	localStorage.setItem("access_token", accessToken)
}

const removeAccessToken = () => {
	localStorage.removeItem("access_token")
}

const generateAxiosError = (error) => {
	return new Error(error.response.data.message)
}

const isYesterday = (date) => {
	const today = new Date()
	const yesterday = new Date()
	yesterday.setDate(today.getDate() - 1)

	return (
		date.getDate() === yesterday.getDate() &&
		date.getMonth() === yesterday.getMonth() &&
		date.getFullYear() === yesterday.getFullYear()
	)
}

const isWithinPast7Days = (date) => {
	const today = new Date()
	const sevenDaysAgo = new Date()
	sevenDaysAgo.setDate(today.getDate() - 7)

	return date >= sevenDaysAgo && date <= today
}

const formatDate = (time) => {
	const ogDate = new Date(time)
	let date = ""

	const options = {
		weekday: "long",
		year: "2-digit",
		month: "2-digit",
		day: "2-digit",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	}

	const formatter = new Intl.DateTimeFormat("en-US", options)
	const format = formatter.format(ogDate)
	const formatList = format.split(", ")

	const current = new Date()

	if (ogDate.toDateString() === current.toDateString()) {
		date = formatList[2]
	} else if (isYesterday(ogDate)) {
		date = "Yesterday"
	} else if (isWithinPast7Days(ogDate)) {
		date = formatList[0]
	} else {
		date = formatList[1]
	}

	return date
}

export {
	getAccessToken,
	setAccessToken,
	generateAxiosError,
	removeAccessToken,
	formatDate,
}
