// src/App.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import { Box, CircularProgress } from "@mui/material";

// Lazy page chunks
const ActivitiesFilterListPage = lazy(() =>
    import("./features/activities/pages/ActivitiesFilterListPage.jsx")
);
const ActivityUpsertPage = lazy(() =>
    import("./features/activities/pages/ActivityUpsertPage")
);
const CategoriesListPage = lazy(() =>
    import("./features/categories/pages/CategoriesListPage")
);
const CategoryUpsertPage = lazy(() =>
    import("./features/categories/pages/CategoryUpsertPage")
);

// Simple loader for Suspense
function Loader() {
    return (
        <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
        </Box>
    );
}

export default function App() {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/activities" replace />} />

                    <Route path="activities">
                        <Route index element={<ActivitiesFilterListPage />} />
                        <Route path="new" element={<ActivityUpsertPage />} />
                        <Route path=":id" element={<ActivityUpsertPage />} />
                    </Route>

                    <Route path="categories">
                        <Route index element={<CategoriesListPage />} />
                        <Route path="new" element={<CategoryUpsertPage />} />
                        <Route path=":id" element={<CategoryUpsertPage />} />
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
}
