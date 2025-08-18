import React, { useEffect, useState } from "react";
import { Stack, TextField, MenuItem, Button, Chip, Box } from "@mui/material";
import { useDebouncedValue } from "../../../shared/hooks/useDebouncedValue";

export default function ActivitiesFilters({ value, categories, onChange, onClear }) {
    const [qLocal, setQLocal] = useState(value.q || "");
    const [minLocal, setMinLocal] = useState(value.min || "");
    const [maxLocal, setMaxLocal] = useState(value.max || "");

    useEffect(() => { setQLocal(value.q || ""); }, [value.q]);
    useEffect(() => { setMinLocal(value.min || ""); }, [value.min]);
    useEffect(() => { setMaxLocal(value.max || ""); }, [value.max]);

    const debouncedQ = useDebouncedValue(qLocal, 400);
    useEffect(() => { onChange({ q: debouncedQ.trim() }); }, [debouncedQ, onChange]);

    const activeChips = [
        value.q && { key: "q", label: `Search: ${value.q}` },
        value.categoryId && {
            key: "categoryId",
            label: `Category: ${categories.find((c) => String(c.id) === String(value.categoryId))?.name || value.categoryId}`,
        },
        value.min && { key: "min", label: `Min: ${value.min}m` },
        value.max && { key: "max", label: `Max: ${value.max}m` },
    ].filter(Boolean);

    return (
        <>
            <Stack direction={{ xs: "column", md: "row" }} gap={1.5} alignItems="center" mb={1.5}>
                <TextField
                    size="small"
                    label="Search"
                    placeholder="Name or description"
                    value={qLocal}
                    onChange={(e) => setQLocal(e.target.value)}
                    sx={{ minWidth: 220 }}
                />
                <TextField
                    size="small"
                    select
                    label="Category"
                    value={value.categoryId || ""}
                    onChange={(e) => onChange({ categoryId: e.target.value })}
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="">All</MenuItem>
                    {categories.map((c) => (
                        <MenuItem key={c.id} value={String(c.id)}>
                            {c.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    size="small"
                    type="number"
                    label="Min (min)"
                    inputProps={{ min: 0 }}
                    value={minLocal}
                    onChange={(e) => {
                        setMinLocal(e.target.value);
                        onChange({ min: e.target.value });
                    }}
                    sx={{ width: 130 }}
                />
                <TextField
                    size="small"
                    type="number"
                    label="Max (min)"
                    inputProps={{ min: 0 }}
                    value={maxLocal}
                    onChange={(e) => {
                        setMaxLocal(e.target.value);
                        onChange({ max: e.target.value });
                    }}
                    sx={{ width: 130 }}
                />
                <Box flex={1} />
                <Button variant="text" onClick={onClear} disabled={activeChips.length === 0}>
                    Clear filters
                </Button>
            </Stack>

            {activeChips.length > 0 && (
                <Stack direction="row" gap={1} flexWrap="wrap" mb={2}>
                    {activeChips.map((c) => (
                        <Chip
                            key={c.key}
                            label={c.label}
                            onDelete={() => onChange({ [c.key]: "" })}
                            variant="outlined"
                            size="small"
                        />
                    ))}
                </Stack>
            )}
        </>
    );
}
