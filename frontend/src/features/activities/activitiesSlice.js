import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import {getActivities, createActivity, updateActivity, deleteActivity} from "../../api/activitiesApi"

export const fetchActivities = createAsyncThunk("activities/fetchAll", async () => {
    const {data} = await getActivities()
    return data
})

export const addActivity = createAsyncThunk("activities/add", async (payload) => {
    const {data} = await createActivity(payload)
    return data
})

export const editActivity = createAsyncThunk("activities/edit", async ({id, changes}) => {
    const {data} = await updateActivity(id, changes)
    return data
})

export const removeActivity = createAsyncThunk("activities/remove", async (id) => {
    await deleteActivity(id)
    return id
})

const activitiesSlice = createSlice({
    name: "activities",
    initialState: {items: [], status: "idle", error: null},
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchActivities.pending, (s) => {
            s.status = "loading";
            s.error = null
        })
            .addCase(fetchActivities.fulfilled, (s, a) => {
                s.status = "succeeded";
                s.items = a.payload
            })
            .addCase(fetchActivities.rejected, (s, a) => {
                s.status = "failed";
                s.error = a.error?.message || "Failed to load"
            })
            .addCase(addActivity.fulfilled, (s, a) => {
                s.items.unshift(a.payload)
            })
            .addCase(editActivity.fulfilled, (s, a) => {
                const i = s.items.findIndex(x => x.id === a.payload.id)
                if (i !== -1) s.items[i] = a.payload
            })
            .addCase(removeActivity.fulfilled, (s, a) => {
                s.items = s.items.filter(x => x.id !== a.payload)
            })
    }
})

export default activitiesSlice.reducer
