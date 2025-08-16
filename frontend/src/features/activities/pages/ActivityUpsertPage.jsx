import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../../api/axiosClient";
import { addOne, updateOne, setAll, setLoading, setError } from "../activitiesSlice";
import ActivityForm from "../components/ActivityForm";
import { Box, CircularProgress, Alert } from "@mui/material";

export default function ActivityUpsertPage() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const activityId = isEdit ? Number(id) : null;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { items, loading, error } = useSelector((s) => s.activities);

    const [submitting, setSubmitting] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [fetchedActivity, setFetchedActivity] = useState(null);

    const fromStore = useMemo(
        () => (isEdit ? items.find((a) => a.id === activityId) : null),
        [items, isEdit, activityId]
    );

    useEffect(() => {
        if (!isEdit) return;
        let ignore = false;
        (async () => {
            if (fromStore) {
                setFetchedActivity(fromStore);
                return;
            }
            try {
                const { data } = await axiosClient.get(`/activities/${activityId}`);
                if (!ignore) setFetchedActivity(data);
            } catch {
                try {
                    dispatch(setLoading());
                    const { data: list } = await axiosClient.get("/activities");
                    dispatch(setAll(list));
                } catch (e2) {
                    const msg = e2.response?.data?.message || e2.message;
                    dispatch(setError(msg));
                    setLocalError(msg);
                }
            }
        })();
        return () => { ignore = true; };
    }, [isEdit, fromStore, activityId, dispatch]);

    const handleSubmit = async (values) => {
        setSubmitting(true);
        setLocalError(null);
        try {
            if (isEdit) {
                const { data } = await axiosClient.put(`/activities/${activityId}`, values);
                dispatch(updateOne(data));
            } else {
                const { data } = await axiosClient.post("/activities", values);
                dispatch(addOne(data));
            }
            navigate("/activities/day");
        } catch (e) {
            const msg = e.response?.data?.message || e.message;
            setLocalError(msg);
            dispatch(setError(msg));
        } finally {
            setSubmitting(false);
        }
    };

    if (isEdit && loading && !fromStore && !fetchedActivity) {
        return (
            <Box p={3} display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }
    if (isEdit && error && !fromStore && !fetchedActivity) {
        return (
            <Box p={3}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    const initial = isEdit ? (fromStore || fetchedActivity) : null;
    if (isEdit && !initial) {
        return (
            <Box p={3}>
                <Alert severity="warning">Activity not found.</Alert>
            </Box>
        );
    }

    return (
        <ActivityForm
            mode={isEdit ? "edit" : "create"}
            initialValues={
                initial
                    ? {
                        name: initial.name,
                        description: initial.description,
                        startAt: initial.startAt,         // <<< pass startAt (not date)
                        durationMinutes: initial.durationMinutes,
                        categoryId: initial.categoryId,
                    }
                    : undefined
            }
            onSubmit={handleSubmit}
            submitting={submitting}
            error={localError}
        />
    );
}
