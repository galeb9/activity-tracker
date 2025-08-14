import axiosClient from "./axiosClient"

export const getActivities = () => axiosClient.get("/activities")
export const createActivity = (data) => axiosClient.post("/activities", data)
export const updateActivity = (id, data) => axiosClient.put(`/activities/${id}`, data)
export const deleteActivity = (id) => axiosClient.delete(`/activities/${id}`)
