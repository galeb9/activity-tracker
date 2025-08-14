import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import axiosClient from "../../../api/axiosClient.js"; // your central Axios instance
import {
    setLoading,
    setError,
    setAll,
    removeOne
} from "../activitiesSlice.js";

export default function ActivitiesList() {
    const dispatch = useDispatch();
    const {items, loading, error} = useSelector((s) => s.activities);

    useEffect(() => {
        const loadActivities = async () => {
            dispatch(setLoading());
            try {
                const {data} = await axiosClient.get("/activities");
                dispatch(setAll(data));
            } catch (err) {
                dispatch(setError(err.response?.data?.message || err.message));
            }
        };
        loadActivities();
    }, [dispatch]);

    const deleteActivity = async (id) => {
        try {
            await axiosClient.delete(`/activities/${id}`);
            dispatch(removeOne(id));
        } catch (err) {
            dispatch(setError(err.response?.data?.message || err.message));
        }
    };

    if (loading) return <p>Loading…</p>;
    if (error) return <p>Error: {error}</p>;
    if (!items.length) return <p>No activities yet.</p>;

    return (
        <ul>
            {items.map((a) => (
                <li key={a.id} style={{display: "flex", gap: 8, alignItems: "center"}}>
                    <span>{a.name}</span>
                    <button onClick={() => deleteActivity(a.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
}
