import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchActivities, removeActivity } from "./activitiesSlice"

export default function ActivitiesList() {
    const dispatch = useDispatch()
    const { items, status, error } = useSelector((s) => s.activities)

    useEffect(() => { dispatch(fetchActivities()) }, [dispatch])

    if (status === "loading") return <p>Loading…</p>
    if (status === "failed") return <p>Error: {error}</p>
    if (!items.length) return <p>No activities yet.</p>

    return (
        <ul>
            {items.map(a => (
                <li key={a.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>
            <strong>{a.name}</strong> — {a.durationMinutes} min on {a.date}
              {a.categoryName ? ` [${a.categoryName}]` : ""}
          </span>
                    <button onClick={() => dispatch(removeActivity(a.id))}>Delete</button>
                </li>
            ))}
        </ul>
    )
}
