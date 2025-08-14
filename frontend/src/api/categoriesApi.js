import axiosClient from "./axiosClient"

export const getCategories = () => axiosClient.get("/categories")
export const createCategory = (data) => axiosClient.post("/categories", data)
