import React, {useEffect, useState} from "react";
import {z} from "zod";
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Box, Stack, TextField, Button, Alert, Typography, MenuItem
} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import axiosClient from "../../../api/axiosClient";
import {Link as RouterLink} from "react-router-dom";
import ClearIcon from '@mui/icons-material/Clear';

const ActivitySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    description: z.string().max(500, "Max 500 characters").optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date"),
    startTime: z
        .string()
        .regex(/^$|^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm")
        .optional()
        .default(""),
    durationMinutes: z.coerce.number().int().min(1, "Duration must be at least 1 minute"),
    categoryId: z.union([z.literal(""), z.coerce.number().int()])
        .refine((v) => v !== "", {message: "Please select a category"})
        .transform((v) => Number(v)),
});

export default function ActivityForm({
     mode,
     initialValues,
     onSubmit,
     submitting = false,
     error = null,
 }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const {data} = await axiosClient.get("/categories");
                setCategories(data || []);
            } catch {
            }
        })();
    }, []);

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
        reset,
        setValue,
    } = useForm({
        resolver: zodResolver(ActivitySchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            description: initialValues?.description ?? "",
            date: initialValues?.startAt
                ? dayjs(initialValues.startAt).format("YYYY-MM-DD")
                : initialValues?.date ?? dayjs().format("YYYY-MM-DD"),
            startTime: initialValues?.startAt
                ? dayjs(initialValues.startAt).format("HH:mm")
                : "",
            durationMinutes: initialValues?.durationMinutes ?? 30,
            categoryId: initialValues?.categoryId ?? "",
        },
    });

    useEffect(() => {
        if (initialValues) {
            reset({
                name: initialValues.name ?? "",
                description: initialValues.description ?? "",
                date: initialValues.startAt
                    ? dayjs(initialValues.startAt).format("YYYY-MM-DD")
                    : initialValues.date ?? dayjs().format("YYYY-MM-DD"),
                startTime: initialValues.startAt
                    ? dayjs(initialValues.startAt).format("HH:mm")
                    : "",
                durationMinutes: initialValues.durationMinutes ?? 30,
                categoryId: initialValues.categoryId ?? "",
            });
        }
    }, [initialValues, reset]);

    const handleSubmitLocal = handleSubmit((values) => {
        const startAt = values.startTime
            ? `${values.date}T${values.startTime}:00`
            : `${values.date}T00:00:00`;
        const payload = {
            name: values.name,
            description: values.description || "",
            startAt,
            durationMinutes: values.durationMinutes,
            categoryId: values.categoryId,
        };
        onSubmit(payload);
    });

    return (
        <Box p={3} maxWidth={520} mx="auto" component="form" onSubmit={handleSubmitLocal}>
            <Stack spacing={2}>
                <Typography variant="h5">
                    {mode === "edit" ? "Edit Activity" : "New Activity"}
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                    label="Name"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    autoFocus
                />

                <TextField
                    label="Description"
                    multiline
                    rows={3}
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                />

                <Controller
                    name="date"
                    control={control}
                    render={({field}) => (
                        <DatePicker
                            label="Date"
                            value={dayjs(field.value)}
                            onChange={(d) => setValue("date", d ? d.format("YYYY-MM-DD") : "")}
                            slotProps={{
                                textField: {error: !!errors.date, helperText: errors.date?.message},
                            }}
                        />
                    )}
                />

                <Controller
                    name="startTime"
                    control={control}
                    render={({field, fieldState}) => (
                        <TimePicker
                            label="Time (HH:mm)"
                            value={field.value ? dayjs(field.value, "HH:mm") : null}
                            onChange={(v) => field.onChange(v ? v.format("HH:mm") : "")}
                            slotProps={{
                                textField: {error: !!fieldState.error, helperText: fieldState.error?.message},
                            }}
                        />
                    )}
                />

                <TextField
                    label="Duration (minutes)"
                    type="number"
                    {...register("durationMinutes")}
                    error={!!errors.durationMinutes}
                    helperText={errors.durationMinutes?.message}
                />

                <Controller
                    name="categoryId"
                    control={control}
                    render={({field}) => (
                        <TextField
                            select
                            label="Category"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            error={!!errors.categoryId}
                            helperText={errors.categoryId?.message}
                        >
                            <MenuItem value="">Select category…</MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                />
                <Stack direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" gap={2}>
                    <Button className="ml-auto" component={RouterLink} to="/activities" variant="outlined" startIcon={<ClearIcon />}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={mode === "edit" ? <SaveIcon/> : <AddIcon/>}
                        disabled={submitting}
                    >
                        {submitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Create"}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
