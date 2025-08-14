import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { addCategory } from "./categoriesSlice"

export default function CategoryForm() {
    const dispatch = useDispatch()
    const [name, setName] = useState("")

    const submit = async (e) => {
        e.preventDefault()
        if (!name.trim()) return
        await dispatch(addCategory({ name }))
        setName("")
    }

    return (
        <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Category name" />
            <button type="submit">Add</button>
        </form>
    )
}