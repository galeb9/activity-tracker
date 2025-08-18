import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axiosClient from "../../../api/axiosClient";
import { setLoading, setError, setPageResult, removeOne, setAll } from "../activitiesSlice";
import { setAll as setCategoriesAll } from "../../categories/categoriesSlice";
import ActivitiesFilters from "../components/ActivitiesFilters";
import ActivityStepItem from "../components/ActivityStepItem";

import {
    Box, Stack, Typography, Button, Alert, CircularProgress,
    Stepper, Chip, IconButton, Tooltip
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SwapVertIcon from "@mui/icons-material/SwapVert";

dayjs.extend(relativeTime);

export default function ActivitiesFilterListPage() {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((s) => s.activities);
    const categories = useSelector((s) => s.categories.items);

    const [searchParams, setSearchParams] = useSearchParams();
    const todayStr = dayjs().format("YYYY-MM-DD");
    const dateParam = searchParams.get("date") || todayStr;
    const [date, setDate] = useState(dayjs(dateParam));

    const setParams = useCallback((patch) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(patch).forEach(([k, v]) => {
            if (v === "" || v == null) next.delete(k);
            else next.set(k, String(v));
        });
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        const next = new URLSearchParams(searchParams);
        next.set("date", date.format("YYYY-MM-DD"));
        if (!next.get("order")) next.set("order", "asc");
        setSearchParams(next, { replace: true });
    }, [date, searchParams, setSearchParams]);

    useEffect(() => {
        if (categories.length) return;

        (async () => {
            if (categories.length) return;
            try {
                const { data } = await axiosClient.get("/categories");
                dispatch(setCategoriesAll(data));
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        })();
    }, [categories.length, dispatch]);

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
        const abort = new AbortController();
        (async () => {
            dispatch(setLoading());
            const d = searchParams.get("date") || todayStr;
            const order = (searchParams.get("order") || "asc").toLowerCase() === "desc" ? "desc" : "asc";
            const q = searchParams.get("q");
            const cat = searchParams.get("categoryId");
            const min = searchParams.get("min");
            const max = searchParams.get("max");

            const params = {
                from: d,
                to: d,
                page: 0,
                size: 100,
                sort: [`startAt,${order}`, "id,desc"],
            };
            if (q) params.q = q;
            if (cat) params.categoryId = Number(cat);
            if (min) params.minMinutes = Number(min);
            if (max) params.maxMinutes = Number(max);

            try {
                const { data } = await axiosClient.get("/activities/search", {
                    params,
                    paramsSerializer: { indexes: null },
                    signal: abort.signal,
                });
                const normalized = normalizePage(data);
                dispatch(setPageResult({ ...normalized, query: params }));
            } catch (e) {
                if (e.name !== "CanceledError" && e.name !== "AbortError") {
                    dispatch(setError(e.response?.data?.message || e.message));
                }
            }
        })();
        return () => abort.abort();
    }, [searchParams, dispatch]);

    const deleteActivity = useCallback(async (id) => {
        const prev = items;
        dispatch(removeOne(id));
        try {
            await axiosClient.delete(`/activities/${id}`);
        } catch (e) {
            dispatch(setAll(prev));
            dispatch(setError(e.response?.data?.message || e.message));
        }
    }, [items, dispatch]);

    const order = (searchParams.get("order") || "asc").toLowerCase() === "desc" ? "desc" : "asc";

    const sorted = useMemo(() => {
        const arr = [...items];
        const cmpAsc = (a, b) => {
            const ta = a.startAt ? dayjs(a.startAt).valueOf() : Number.POSITIVE_INFINITY;
            const tb = b.startAt ? dayjs(b.startAt).valueOf() : Number.POSITIVE_INFINITY;
            if (ta !== tb) return ta - tb;
            return Number(b.id) - Number(a.id);
        };
        const cmpDesc = (a, b) => {
            const ta = a.startAt ? dayjs(a.startAt).valueOf() : Number.NEGATIVE_INFINITY;
            const tb = b.startAt ? dayjs(b.startAt).valueOf() : Number.NEGATIVE_INFINITY;
            if (ta !== tb) return tb - ta;
            return Number(b.id) - Number(a.id);
        };
        return arr.sort(order === "asc" ? cmpAsc : cmpDesc);
    }, [items, order]);

    const totalMinutes = useMemo(
        () => sorted.reduce((sum, a) => sum + (Number(a.durationMinutes) || 0), 0),
        [sorted]
    );

    const goPrevDay = () => setDate((d) => d.subtract(1, "day"));
    const goNextDay = () => setDate((d) => d.add(1, "day"));
    const isFuture = date.isAfter(dayjs(), "day");

    return (
        <Box p={3} maxWidth={980} mx="auto">
            <Stack direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" gap={2} mb={2}>

                <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="h4">
                        Activities on
                    </Typography>
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
                    {totalMinutes > 0 &&
                        <Tooltip title={order === "asc" ? "Latest at bottom (ASC). Click to invert." : "Latest at top (DESC). Click to invert."}>
                            <IconButton
                                size="small"
                                onClick={() => setParams({ order: order === "asc" ? "desc" : "asc" })}
                                aria-label="Toggle order"
                            >
                                <SwapVertIcon />
                            </IconButton>
                        </Tooltip>
                    }
                </Stack>
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
            {totalMinutes > 0 && (
                <Box>
                    <ActivitiesFilters
                        value={{
                            q: searchParams.get("q") || "",
                            categoryId: searchParams.get("categoryId") || "",
                            min: searchParams.get("min") || "",
                            max: searchParams.get("max") || "",
                        }}
                        categories={categories}
                        onChange={setParams}
                        onClear={() => setParams({ q: "", categoryId: "", min: "", max: "" })}
                    />

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box mb={2}>
                        <Chip label={`Total: ${totalMinutes} min`} />
                    </Box>
                </Box>
                )
            }

            {loading ? (
                <Box p={3} display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            ) : sorted.length === 0 ? (
                <Alert severity="info">No activities for this day.</Alert>
            ) : (
                <Stepper orientation="vertical" nonLinear activeStep={order === "asc" ? sorted.length - 1 : 0}>
                    {sorted.map((a) => (
                        <ActivityStepItem
                            key={a.id}
                            activity={a}
                            editHref={`/activities/${a.id}`}
                            onDeleteClick={() => deleteActivity(a.id)}
                            onFilter={(patch) => setParams(patch)}
                        />
                    ))}
                </Stepper>
            )}
        </Box>
    );
}
