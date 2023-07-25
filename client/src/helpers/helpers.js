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

export { getAccessToken, setAccessToken, generateAxiosError, removeAccessToken }
