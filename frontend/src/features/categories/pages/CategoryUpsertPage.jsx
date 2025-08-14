import React, {useEffect, useMemo, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axiosClient from "../../../api/axiosClient";
import {addOne, updateOne, setAll, setLoading, setError} from "../categoriesSlice";
import CategoryForm from "../components/CategoryForm";
import {Box, CircularProgress, Alert} from "@mui/material";

export default function CategoryUpsertPage() {
    const {id} = useParams();
    const isEdit = Boolean(id);
    const categoryId = isEdit ? Number(id) : null;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {items, loading, error} = useSelector((s) => s.categories);

    const [submitting, setSubmitting] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [fetchedCategory, setFetchedCategory] = useState(null);

    const fromStore = useMemo(
        () => (isEdit ? items.find((c) => c.id === categoryId) : null),
        [items, isEdit, categoryId]
    );

    useEffect(() => {
        if (!isEdit) return;
        let ignore = false;
        (async () => {
            if (fromStore) {
                setFetchedCategory(fromStore);
                return;
            }
            try {
                const {data} = await axiosClient.get(`/categories/${categoryId}`);
                if (!ignore) setFetchedCategory(data);
            } catch {
                try {
                    dispatch(setLoading());
                    const {data: list} = await axiosClient.get("/categories");
                    dispatch(setAll(list));
                } catch (e2) {
                    const msg = e2.response?.data?.message || e2.message;
                    dispatch(setError(msg));
                    setLocalError(msg);
                }
            }
        })();
        return () => {
            ignore = true;
        };
    }, [isEdit, fromStore, categoryId, dispatch]);

    const handleSubmit = async (values) => {
        setSubmitting(true);
        setLocalError(null);
        try {
            if (isEdit) {
                const {data} = await axiosClient.put(`/categories/${categoryId}`, values);
                dispatch(updateOne(data));
            } else {
                const {data} = await axiosClient.post("/categories", values);
                dispatch(addOne(data));
            }
            navigate("/categories");
        } catch (e) {
            const msg = e.response?.data?.message || e.message;
            setLocalError(msg);
            dispatch(setError(msg));
        } finally {
            setSubmitting(false);
        }
    };

    // Loading / error states only matter when editing and we don't yet have data
    if (isEdit && loading && !fromStore && !fetchedCategory) {
        return (
            <Box p={3} display="flex" justifyContent="center">
                <CircularProgress/>
            </Box>
        );
    }
    if (isEdit && error && !fromStore && !fetchedCategory) {
        return (
            <Box p={3}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    const initial = isEdit ? (fromStore || fetchedCategory) : null;
    if (isEdit && !initial) {
        return (
            <Box p={3}>
                <Alert severity="warning">Category not found.</Alert>
            </Box>
        );
    }

    return (
        <CategoryForm
            mode={isEdit ? "edit" : "create"}
            initialValues={initial ? {name: initial.name} : undefined}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={localError}
        />
    );
}
