import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";

import ActivitiesListPage from "./features/activities/pages/ActivitiesListPage";
import ActivityUpsertPage from "./features/activities/pages/ActivityUpsertPage";
import ActivityFiltersPage from "./features/activities/pages/ActivityFiltersPage.jsx";
import ActivityDayPage from "./features/activities/pages/ActivityDayPage";

import CategoriesListPage from "./features/categories/pages/CategoriesListPage";
import CategoryUpsertPage from "./features/categories/pages/CategoryUpsertPage";

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/activities" replace />} />
                <Route path="activities">
                    <Route index element={<ActivitiesListPage />} />
                    <Route path="new" element={<ActivityUpsertPage />} />
                    <Route path=":id" element={<ActivityUpsertPage />} />
                    <Route path="filters" element={<ActivityFiltersPage />} />
                    <Route path="day" element={<ActivityDayPage />} />
                </Route>
                <Route path="categories">
                    <Route index element={<CategoriesListPage />} />
                    <Route path="new" element={<CategoryUpsertPage />} />
                    <Route path=":id" element={<CategoryUpsertPage />} />
                </Route>

            </Route>
        </Routes>
    );
}