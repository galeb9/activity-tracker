import React from "react"
import ActivityForm from "../features/activities/ActivityForm"
import ActivitiesList from "../features/activities/ActivitiesList"

export default function ActivitiesPage() {
    return (
        <div style={{ display: "grid", gap: 16 }}>
            <h2>Activities</h2>
            <ActivityForm />
            <ActivitiesList />
        </div>
    )
}
