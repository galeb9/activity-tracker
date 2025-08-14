import React from "react"
import { Link, Route, Routes, Navigate } from "react-router-dom"
import ActivitiesPage from "./pages/ActivitiesPage"
import CategoriesPage from "./pages/CategoriesPage"

export default function App() {
    return (
        <main style={{ padding: 24, display: "grid", gap: 16 }}>
            <h1>Activity Tracker</h1>

            <nav style={{ display: "flex", gap: 12 }}>
                <Link to="/activities">Activities</Link>
                <Link to="/categories">Categories</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Navigate to="/activities" replace />} />
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="*" element={<p>Not Found</p>} />
            </Routes>
        </main>
    )
}
