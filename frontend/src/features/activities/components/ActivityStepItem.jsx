import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
    Step, StepLabel, StepContent,
    Stack, Typography, Chip, Tooltip, IconButton, Divider
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link as RouterLink } from "react-router-dom";

dayjs.extend(relativeTime);

function getEndAt(a) {
    if (a?.startAt) return dayjs(a.startAt).add(Number(a.durationMinutes || 0), "minute");
    if (a?.createdAt) return dayjs(a.createdAt);
    return null;
}

export default function ActivityStepItem({
     activity,
     editHref,
     onDeleteClick,
     onFilter,
     showDescription = true,
 }) {
    const a = activity;
    const endAt = getEndAt(a);
    const ago = endAt ? endAt.fromNow() : null;

    return (
        <Step expanded>
            <StepLabel>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} flexWrap="wrap">
                    <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                        {a.startAt && (
                            <Chip size="small" variant="outlined" label={dayjs(a.startAt).format("HH:mm")} />
                        )}
                        <Typography fontWeight={600}>{a.name}</Typography>
                        <Chip
                            size="small"
                            label={`${a.durationMinutes} min`}
                            clickable
                            onClick={() => onFilter?.({ min: a.durationMinutes, max: a.durationMinutes })}
                        />

                        {a.categoryName && (
                            <Chip
                                size="small"
                                variant="outlined"
                                label={a.categoryName}
                                clickable
                                onClick={() => onFilter?.({ categoryId: a.categoryId })}
                            />
                        )}

                        {ago && (
                            <Tooltip title={`Finished ${endAt.format("YYYY-MM-DD HH:mm")}`} arrow placement="top">
                                <Chip size="small" label={ago} />
                            </Tooltip>
                        )}
                    </Stack>

                    <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                        <IconButton
                            size="small"
                            color="primary"
                            component={RouterLink}
                            to={editHref}
                            aria-label={`Edit ${a.name}`}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={onDeleteClick}
                            aria-label={`Delete ${a.name}`}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                </Stack>
            </StepLabel>

            {showDescription && a.description && (
                <StepContent>
                    <Typography sx={{ mb: 1 }}>{a.description}</Typography>
                    <Divider />
                </StepContent>
            )}
        </Step>
    );
}
