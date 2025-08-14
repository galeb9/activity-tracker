import { createSlice } from "@reduxjs/toolkit";

const activitiesSlice = createSlice({
    name: "activities",
    initialState: { items: [], loading: false, error: null },
    reducers: {
        setLoading: (s) => { s.loading = true; s.error = null; },
        setError: (s, a) => { s.loading = false; s.error = a.payload || "Error"; },
        setAll: (s, a) => { s.loading = false; s.items = a.payload; },
        addOne: (s, a) => { s.items.unshift(a.payload); }, // newest first
        updateOne: (s, a) => {
            const i = s.items.findIndex(x => x.id === a.payload.id);
            if (i !== -1) s.items[i] = a.payload;
        },
        removeOne: (s, a) => { s.items = s.items.filter(x => x.id !== a.payload); },
    },
});

export const { setLoading, setError, setAll, addOne, updateOne, removeOne } = activitiesSlice.actions;
export default activitiesSlice.reducer;
