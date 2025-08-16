import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import axiosClient from "../../../api/axiosClient";
import {setLoading, setError, setAll, removeOne} from "../activitiesSlice";
import {setAll as setCategoriesAll} from "../../categories/categoriesSlice";

import {
    Box, Stack, Typography, Button, Alert, CircularProgress, Stepper, Step, StepLabel, StepContent,
    TextField, MenuItem, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Chip
} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {Link as RouterLink} from "react-router-dom";

export default function ActivityFiltersPage() {
    const dispatch = useDispatch();
    const {items, loading, error} = useSelector((s) => s.activities);
    const categories = useSelector((s) => s.categories.items);
    const [activeStep, setActiveStep] = useState(0);
    const [filters, setFilters] = useState({
        q: "",
        categoryId: "",
        from: null,
        to: null,
        minMinutes: "",
        maxMinutes: "",
    });
    useEffect(() => {
        (async () => {
            dispatch(setLoading());
            try {
                const [actsRes, catsRes] = await Promise.all([
                    axiosClient.get("/activities"),
                    categories.length ? Promise.resolve({data: categories}) : axiosClient.get("/categories"),
                ]);
                dispatch(setAll(actsRes.data));
                if (!categories.length) dispatch(setCategoriesAll(catsRes.data));
            } catch (e) {
                dispatch(setError(e.response?.data?.message || e.message));
            }
        })();
    }, [dispatch]);

    const filtered = useMemo(() => {
        const q = filters.q.trim().toLowerCase();
        const from = filters.from ? dayjs(filters.from).format("YYYY-MM-DD") : null;
        const to = filters.to ? dayjs(filters.to).format("YYYY-MM-DD") : null;
        const min = filters.minMinutes !== "" ? Number(filters.minMinutes) : null;
        const max = filters.maxMinutes !== "" ? Number(filters.maxMinutes) : null;

        return items.filter((a) => {
            if (q && !(a.name?.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q))) return false;
            if (filters.categoryId && String(a.categoryId) !== String(filters.categoryId)) return false;
            if (from && a.date < from) return false;
            if (to && a.date > to) return false;
            if (min !== null && Number(a.durationMinutes) < min) return false;
            if (max !== null && Number(a.durationMinutes) > max) return false;
            return true;
        });
    }, [items, filters]);

    const clearOne = (key) => {
        setFilters((f) => {
            const next = {...f};
            if (key === "q") next.q = "";
            if (key === "categoryId") next.categoryId = "";
            if (key === "from") next.from = null;
            if (key === "to") next.to = null;
            if (key === "minMinutes") next.minMinutes = "";
            if (key === "maxMinutes") next.maxMinutes = "";
            return next;
        });
    };

    const resetAll = () => {
        setFilters({q: "", categoryId: "", from: null, to: null, minMinutes: "", maxMinutes: ""});
        setActiveStep(0);
    };

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
                <CircularProgress/>
            </Box>
        );
    }

    const chips = [
        filters.q && {label: `Search: ${filters.q}`, onDelete: () => clearOne("q")},
        filters.categoryId && {
            label: `Category: ${categories.find(c => String(c.id) === String(filters.categoryId))?.name || filters.categoryId}`,
            onDelete: () => clearOne("categoryId"),
        },
        filters.from && {label: `From: ${dayjs(filters.from).format("YYYY-MM-DD")}`, onDelete: () => clearOne("from")},
        filters.to && {label: `To: ${dayjs(filters.to).format("YYYY-MM-DD")}`, onDelete: () => clearOne("to")},
        filters.minMinutes !== "" && {label: `Min: ${filters.minMinutes}m`, onDelete: () => clearOne("minMinutes")},
        filters.maxMinutes !== "" && {label: `Max: ${filters.maxMinutes}m`, onDelete: () => clearOne("maxMinutes")},
    ].filter(Boolean);

    return (
        <Box p={3} maxWidth={880} mx="auto">
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Activity Filters (Stepper)</Typography>
                <Button component={RouterLink} to="/activities/new" variant="contained" startIcon={<AddIcon/>}>
                    New
                </Button>
            </Stack>

            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

            <Box mb={2} display="flex" gap={1} flexWrap="wrap">
                {chips.length > 0 && chips.map((c, i) => (
                    <Chip key={i} label={c.label} onDelete={c.onDelete}/>
                ))}
                {chips.length > 0 && (
                    <Button size="small" onClick={resetAll}>Reset all</Button>
                )}
            </Box>

            <Box mb={3}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    <Step>
                        <StepLabel>Search</StepLabel>
                        <StepContent>
                            <TextField
                                fullWidth
                                label="Search by name/description"
                                value={filters.q}
                                onChange={(e) => setFilters((f) => ({...f, q: e.target.value}))}
                            />
                            <Stack direction="row" spacing={1} mt={1}>
                                <Button variant="contained" onClick={() => setActiveStep(1)}>Next</Button>
                                <Button onClick={() => setFilters((f) => ({...f, q: ""}))}>Clear</Button>
                            </Stack>
                        </StepContent>
                    </Step>

                    <Step>
                        <StepLabel>Category</StepLabel>
                        <StepContent>
                            <TextField
                                select
                                label="Category"
                                value={filters.categoryId}
                                onChange={(e) => setFilters((f) => ({...f, categoryId: e.target.value}))}
                                sx={{minWidth: 240}}
                            >
                                <MenuItem value="">All</MenuItem>
                                {categories.map((c) => (
                                    <MenuItem key={c.id} value={String(c.id)}>{c.name}</MenuItem>
                                ))}
                            </TextField>
                            <Stack direction="row" spacing={1} mt={1}>
                                <Button variant="contained" onClick={() => setActiveStep(2)}>Next</Button>
                                <Button onClick={() => setActiveStep(0)}>Back</Button>
                                <Button onClick={() => setFilters((f) => ({...f, categoryId: ""}))}>Clear</Button>
                            </Stack>
                        </StepContent>
                    </Step>

                    <Step>
                        <StepLabel>Date Range</StepLabel>
                        <StepContent>
                            <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
                                <DatePicker
                                    label="From"
                                    value={filters.from ? dayjs(filters.from) : null}
                                    onChange={(d) => setFilters((f) => ({...f, from: d ? d.toISOString() : null}))}
                                />
                                <DatePicker
                                    label="To"
                                    value={filters.to ? dayjs(filters.to) : null}
                                    onChange={(d) => setFilters((f) => ({...f, to: d ? d.toISOString() : null}))}
                                />
                            </Stack>
                            <Stack direction="row" spacing={1} mt={1}>
                                <Button variant="contained" onClick={() => setActiveStep(3)}>Next</Button>
                                <Button onClick={() => setActiveStep(1)}>Back</Button>
                                <Button onClick={() => setFilters((f) => ({...f, from: null, to: null}))}>Clear</Button>
                            </Stack>
                        </StepContent>
                    </Step>

                    <Step>
                        <StepLabel>Duration Range</StepLabel>
                        <StepContent>
                            <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
                                <TextField
                                    label="Min minutes"
                                    type="number"
                                    inputProps={{min: 0}}
                                    value={filters.minMinutes}
                                    onChange={(e) => setFilters((f) => ({...f, minMinutes: e.target.value}))}
                                />
                                <TextField
                                    label="Max minutes"
                                    type="number"
                                    inputProps={{min: 0}}
                                    value={filters.maxMinutes}
                                    onChange={(e) => setFilters((f) => ({...f, maxMinutes: e.target.value}))}
                                />
                            </Stack>
                            <Stack direction="row" spacing={1} mt={1}>
                                <Button variant="contained" onClick={() => setActiveStep(0)}>Done</Button>
                                <Button onClick={() => setActiveStep(2)}>Back</Button>
                                <Button onClick={() => setFilters((f) => ({
                                    ...f,
                                    minMinutes: "",
                                    maxMinutes: ""
                                }))}>Clear</Button>
                            </Stack>
                        </StepContent>
                    </Step>
                </Stepper>
            </Box>

            {/* Results */}
            {filtered.length === 0 ? (
                <Alert severity="info">No activities match your filters.</Alert>
            ) : (
                <List>
                    {filtered.map((a) => (
                        <ListItem key={a.id} divider>
                            <ListItemText
                                primary={`${a.name} • ${a.date} • ${a.durationMinutes}m`}
                                secondary={`${a.categoryName ?? ""}${a.categoryName ? " — " : ""}${a.description ?? ""}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton component={RouterLink} to={`/activities/${a.id}`} sx={{mr: 1}}>
                                    <EditIcon/>
                                </IconButton>
                                <IconButton color="error" onClick={() => deleteActivity(a.id)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}
