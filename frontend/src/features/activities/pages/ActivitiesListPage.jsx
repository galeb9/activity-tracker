import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../../api/axiosClient";
import { setLoading, setError, setAll, removeOne } from "../activitiesSlice";
import {
    Box, List, ListItem, ListItemText, ListItemSecondaryAction,
    IconButton, CircularProgress, Alert, Typography, Button, Stack
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function ActivitiesListPage() {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((s) => s.activities);

    useEffect(() => {
        (async () => {
            dispatch(setLoading());
            try {
                const { data } = await axiosClient.get("/activities");
                dispatch(setAll(data));
            } catch (e) {
                dispatch(setError(e.response?.data?.message || e.message));
            }
        })();
    }, [dispatch]);

    const deleteActivity = async (id) => {
        try {
            await axiosClient.delete(`/activities/${id}`);
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
                <Typography variant="h4">Activities</Typography>
                <Button component={RouterLink} to="/activities/new" variant="contained" startIcon={<AddIcon />}>
                    New
                </Button>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {items.length === 0 ? (
                <Alert severity="info">No activities yet.</Alert>
            ) : (
                <List>
                    {items.map((a) => (
                        <ListItem key={a.id} divider>
                            <ListItemText primary={a.name} secondary={a.description} />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    component={RouterLink}
                                    to={`/activities/${a.id}`}
                                    sx={{ mr: 1 }}
                                    aria-label="edit"
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" color="error" onClick={() => deleteActivity(a.id)} aria-label="delete">
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
