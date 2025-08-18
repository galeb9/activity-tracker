import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../../api/axiosClient";
import { setLoading, setError, setAll, removeOne } from "../categoriesSlice";
import {
    Box, List, ListItem, ListItemText, ListItemSecondaryAction,
    IconButton, CircularProgress, Alert, Typography, Button, Stack
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function CategoriesListPage() {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((s) => s.categories);

    useEffect(() => {
        (async () => {
            dispatch(setLoading());
            try {
                const { data } = await axiosClient.get("categories");
                dispatch(setAll(data));
            } catch (e) {
                dispatch(setError(e.response?.data?.message || e.message));
            }
        })();
    }, [dispatch]);

    const deleteCategory = async (id) => {
        try {
            await axiosClient.delete(`categories/${id}`);
            dispatch(removeOne(id));
        } catch (e) {
            dispatch(setError(e.response?.data?.message || e.message));
        }
    };

    if (loading) {
        return (
            <Box p={3} display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3} maxWidth={880} mx="auto">
            <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography variant="h4">Categories</Typography>
                <Button component={RouterLink} to="/categories/new" variant="contained" startIcon={<AddIcon />}>
                    New
                </Button>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {items.length === 0 ? (
                <Alert severity="info">No categories yet.</Alert>
            ) : (
                <List>
                    {items.map((c) => (
                        <ListItem key={c.id} divider>
                            <ListItemText primary={c.name} />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    component={RouterLink}
                                    to={`/categories/${c.id}`}
                                    sx={{ mr: 1 }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" color="error" onClick={() => deleteCategory(c.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}
