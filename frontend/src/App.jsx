import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";

import ActivitiesFilterListPage from "./features/activities/pages/ActivitiesFilterListPage.jsx";
import ActivityUpsertPage from "./features/activities/pages/ActivityUpsertPage";

import CategoriesListPage from "./features/categories/pages/CategoriesListPage";
import CategoryUpsertPage from "./features/categories/pages/CategoryUpsertPage";

export default function App() {
    return (
        <Routes>
            <Route element={<Layout/>}>
                <Route path="/" element={<Navigate to="/activities" replace/>}/>
                <Route path="activities">
                    <Route index element={<ActivitiesFilterListPage/>}/>
                    <Route path="new" element={<ActivityUpsertPage/>}/>
                    <Route path=":id" element={<ActivityUpsertPage/>}/>
                </Route>
                <Route path="categories">
                    <Route index element={<CategoriesListPage/>}/>
                    <Route path="new" element={<CategoryUpsertPage/>}/>
                    <Route path=":id" element={<CategoryUpsertPage/>}/>
                </Route>
            </Route>
        </Routes>
    );
}