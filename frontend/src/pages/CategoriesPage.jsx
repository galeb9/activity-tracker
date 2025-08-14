import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCategories } from "../features/categories/categoriesSlice"
import CategoryForm from "../features/categories/CategoryForm"

export default function CategoriesPage() {
    const dispatch = useDispatch()
    const { items, status } = useSelector((s) => s.categories)

    useEffect(() => { dispatch(fetchCategories()) }, [dispatch])

    return (
        <div style={{ display: "grid", gap: 16 }}>
            <h2>Categories</h2>
            <CategoryForm />
            {status === "loading" ? <p>Loading…</p> : (
                <ul>{items.map(c => <li key={c.id}>{c.name}</li>)}</ul>
            )}
        </div>
    )
}
