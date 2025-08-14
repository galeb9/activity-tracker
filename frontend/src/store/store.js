import { configureStore } from "@reduxjs/toolkit"
import activities from "../features/activities/activitiesSlice"
import categories from "../features/categories/categoriesSlice"

export const store = configureStore({
    reducer: { activities, categories }
})
