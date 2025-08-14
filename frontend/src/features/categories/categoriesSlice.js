import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getCategories, createCategory } from "../../api/categoriesApi"

export const fetchCategories = createAsyncThunk("categories/fetchAll", async () => {
    const { data } = await getCategories()
    console.log(data)
    return data
})

export const addCategory = createAsyncThunk("categories/add", async (payload) => {
    const { data } = await createCategory(payload)
    return data
})

const categoriesSlice = createSlice({
    name: "categories",
    initialState: { items: [], status: "idle", error: null },
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchCategories.pending, (s) => { s.status = "loading"; s.error = null })
            .addCase(fetchCategories.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload })
            .addCase(fetchCategories.rejected, (s, a) => { s.status = "failed"; s.error = a.error?.message || "Failed to load" })
            .addCase(addCategory.fulfilled, (s, a) => { s.items.push(a.payload) })
    }
})

export default categoriesSlice.reducer
