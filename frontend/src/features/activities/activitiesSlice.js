import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    loading: false,
    error: null,
    page: 0,
    size: 20,
    totalPages: 1,
    totalElements: 0,
    lastQuery: {},
};

const activitiesSlice = createSlice({
    name: "activities",
    initialState,
    reducers: {
        setLoading: (s) => { s.loading = true; s.error = null; },
        setError: (s, a) => { s.loading = false; s.error = a.payload || "Error"; },

        setAll: (s, a) => {
            s.loading = false;
            s.items = a.payload;
            s.page = 0;
            s.size = a.payload?.length ?? 0;
            s.totalPages = 1;
            s.totalElements = s.size;
        },

        setPageResult: (s, a) => {
            const { items, page=0, size=items.length, totalPages=1, totalElements=items.length, query } = a.payload;
            s.loading = false;
            s.items = items;
            s.page = page;
            s.size = size;
            s.totalPages = totalPages;
            s.totalElements = totalElements;
            if (query) s.lastQuery = query;
        },

        addOne: (s, a) => { s.items.unshift(a.payload); s.totalElements += 1; },
        updateOne: (s, a) => {
            const i = s.items.findIndex(x => x.id === a.payload.id);
            if (i !== -1) s.items[i] = a.payload;
        },
        removeOne: (s, a) => {
            s.items = s.items.filter(x => x.id !== a.payload);
            s.totalElements = Math.max(0, s.totalElements - 1);
        },
    },
});

export const { setLoading, setError, setAll, setPageResult, addOne, updateOne, removeOne } =
    activitiesSlice.actions;

export default activitiesSlice.reducer;
