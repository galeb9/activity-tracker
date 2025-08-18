import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Box, Stack, TextField, Button, Alert, Typography
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";

const CategorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Max 50 characters"),
});

export default function CategoryForm({
 mode,
 initialValues,
 onSubmit,
 submitting = false,
 error = null,
}) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(CategorySchema),
        defaultValues: { name: initialValues?.name || "" },
        values: { name: initialValues?.name || "" },
    });

    return (
        <Box p={3} maxWidth={520} mx="auto" component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                <Typography variant="h5">
                    {mode === "edit" ? "Edit Category" : "New Category"}
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                    label="Name"
                    placeholder="Category name"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    autoFocus
                />

                <Button
                    type="submit"
                    variant="contained"
                    startIcon={mode === "edit" ? <SaveIcon /> : <AddIcon />}
                    disabled={submitting}
                >
                    {submitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Create"}
                </Button>
            </Stack>
        </Box>
    );
}
