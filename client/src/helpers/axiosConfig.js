import axios from "axios"
import { getAccessToken, setAccessToken } from "./helpers"

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URI,
    withCredentials: true,
})

api.interceptors.request.use((request) => {
    request.headers["Authorization"] = getAccessToken()
    return request
}, (error) => {
    return Promise.reject(error)
})

api.interceptors.response.use((response) => {
    if (response.headers["authorization"]) {
        setAccessToken(response.headers["authorization"])
    }
    return response
}, (error) => {
    return Promise.reject(error)
})

export default api