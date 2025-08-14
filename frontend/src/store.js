import {configureStore} from "@reduxjs/toolkit"
import activities from "./features/activities/activitiesSlice.js"
import categories from "./features/categories/categoriesSlice.js"

export const store = configureStore({
    reducer: {activities, categories}
})
