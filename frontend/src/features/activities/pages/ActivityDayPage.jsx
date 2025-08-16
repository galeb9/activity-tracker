import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import dayjs from "dayjs";
import axiosClient from "../../../api/axiosClient";
import { setLoading, setError, setPageResult, removeOne, setAll } from "../activitiesSlice";
import { setAll as setCategoriesAll } from "../../categories/categoriesSlice";
import {
    Box,
    Stack,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Chip,
    IconButton,
    Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function ActivityDayPage() {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((s) => s.activities);
    const categories = useSelector((s) => s.categories.items);

    const [searchParams, setSearchParams] = useSearchParams();
    const todayStr = dayjs().format("YYYY-MM-DD");
    const dateParam = searchParams.get("date") || todayStr;
    const [date, setDate] = useState(dayjs(dateParam));

    useEffect(() => {
        setSearchParams({ date: date.format("YYYY-MM-DD") }, { replace: true });
    }, [date, setSearchParams]);

    useEffect(() => {
        (async () => {
            if (categories.length) return;
            try {
                const { data } = await axiosClient.get("/categories");
                dispatch(setCategoriesAll(data));
            } catch {}
        })();
    }, []);

    const normalizePage = (data) => {
        if (Array.isArray(data)) {
            return { items: data, page: 0, size: data.length, totalPages: 1, totalElements: data.length };
        }
        return {
            items: data?.content ?? [],
            page: data?.number ?? 0,
            size: data?.size ?? (data?.content?.length ?? 0),
            totalPages: data?.totalPages ?? 1,
            totalElements: data?.totalElements ?? (data?.content?.length ?? 0),
        };
    };

    useEffect(() => {
        (async () => {
            dispatch(setLoading());
            const d = date.format("YYYY-MM-DD");
            try {
                const { data } = await axiosClient.get("/activities/search", {
                    params: {
                        from: d,
                        to: d,
                        page: 0,
                        size: 100,
                        sort: ["date,desc", "id,desc"],
                    },
                    paramsSerializer: { indexes: null },
                });
                const normalized = normalizePage(data);
                dispatch(setPageResult({ ...normalized, query: { from: d, to: d, page: 0, size: 100 } }));
            } catch (e) {
                dispatch(setError(e.response?.data?.message || e.message));
            }
        })();
    }, [date, dispatch]);

    const deleteActivity = async (id) => {
        const prevItems = items;
        dispatch(removeOne(id));
        try {
            await axiosClient.delete(`/activities/${id}`);
        } catch (e) {
            dispatch(setAll(prevItems));
            dispatch(setError(e.response?.data?.message || e.message));
        }
    };

    const sorted = useMemo(() => [...items].sort((a, b) => Number(b.id) - Number(a.id)), [items]);

    const totalMinutes = useMemo(
        () => sorted.reduce((sum, a) => sum + (Number(a.durationMinutes) || 0), 0),
        [sorted]
    );

    const goPrevDay = () => setDate((d) => d.subtract(1, "day"));
    const goNextDay = () => setDate((d) => d.add(1, "day"));
    const isFuture = date.isAfter(dayjs(), "day");

    if (loading) {
        return (
            <Box p={3} display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3} maxWidth={880} mx="auto">
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems="center"
                justifyContent="space-between"
                gap={2}
                mb={2}
            >
                <Typography variant="h4">Activities on {date.format("YYYY-MM-DD")}</Typography>
                <Stack direction="row" gap={1} alignItems="center">
                    <IconButton onClick={goPrevDay} aria-label="Previous day">
                        <ArrowBackIosNewIcon fontSize="small" />
                    </IconButton>
                    <DatePicker
                        label="Pick a day"
                        value={date}
                        onChange={(d) => d && setDate(d.startOf("day"))}
                        slotProps={{ textField: { size: "small" } }}
                    />
                    <IconButton onClick={goNextDay} aria-label="Next day" disabled={isFuture}>
                        <ArrowForwardIosIcon fontSize="small" />
                    </IconButton>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setDate(dayjs())}
                        disabled={date.isSame(dayjs(), "day")}
                    >
                        Today
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        component={RouterLink}
                        to="/activities/new"
                        startIcon={<AddIcon />}
                    >
                        New
                    </Button>
                </Stack>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box mb={2}>
                <Chip label={`Total: ${totalMinutes} min`} />
            </Box>

            {sorted.length === 0 ? (
                <Alert severity="info">No activities for this day.</Alert>
            ) : (
                <Stepper orientation="vertical" nonLinear activeStep={-1}>
                    {sorted.map((a) => (
                        <Step key={a.id} expanded>
                            <StepLabel>
                                <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                                    <Typography fontWeight={600}>{a.name}</Typography>
                                    <Chip size="small" label={`${a.durationMinutes} min`} />
                                    {a.categoryName && <Chip size="small" variant="outlined" label={a.categoryName} />}
                                </Stack>
                            </StepLabel>
                            <StepContent>
                                <Typography sx={{ mb: 1 }}>{a.description || "No description."}</Typography>
                                <Stack direction="row" gap={1} alignItems="center" sx={{ mb: 1 }}>
                                    <Button
                                        variant="text"
                                        size="small"
                                        startIcon={<EditIcon />}
                                        component={RouterLink}
                                        to={`/activities/${a.id}`}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="text"
                                        color="error"
                                        size="small"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => deleteActivity(a.id)}
                                    >
                                        Delete
                                    </Button>
                                </Stack>
                                <Divider />
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            )}
        </Box>
    );
}
