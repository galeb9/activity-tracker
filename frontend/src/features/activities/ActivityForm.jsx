import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {addActivity} from "./activitiesSlice"
import {fetchCategories} from "../categories/categoriesSlice"

export default function ActivityForm() {
    const dispatch = useDispatch()
    const categories = useSelector((state) => state.categories.items);
    // console.log(categories)
    const [form, setForm] = useState({name: "", description: "", categoryId: "", date: "", durationMinutes: ""})

    useEffect(() => {
        if (!categories.length) dispatch(fetchCategories())
    }, [dispatch, categories.length])

    const submit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.categoryId || !form.date || !form.durationMinutes) return
        await dispatch(addActivity({
            name: form.name,
            description: form.description || null,
            categoryId: Number(form.categoryId),
            date: form.date, // YYYY-MM-DD
            durationMinutes: Number(form.durationMinutes)
        }))
        setForm({name: "", description: "", categoryId: "", date: "", durationMinutes: ""})
    }

    return (
        <form onSubmit={submit} style={{display: "grid", gap: 8, maxWidth: 420}}>
            <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
            <input placeholder="Description" value={form.description}
                   onChange={e => setForm({...form, description: e.target.value})}/>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}/>
            <input type="number" min="1" placeholder="Minutes" value={form.durationMinutes}
                   onChange={e => setForm({...form, durationMinutes: e.target.value})}/>
            <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
                <option value="">Select category</option>
                {/**/}
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button type="submit">Create Activity</button>
        </form>
    )
}
