import axios from "axios"

// With Vite proxy, baseURL can be just '/api'
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api"

const axiosClient = axios.create({
    baseURL,
    headers: {"Content-Type": "application/json"},
})

export default axiosClient
