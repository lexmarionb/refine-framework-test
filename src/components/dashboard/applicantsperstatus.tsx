// Hooks
import { useList } from "@refinedev/core";

// Utilities
import { statusColor } from "@utils/string";

// Types
import type { Applicant } from "@components/dashboard/types";
import {STATUS_OPTIONS} from "@utils/constants";
import {Box, Card, CardContent, Chip, CircularProgress, Stack, Typography} from "@mui/material";

export default function ApplicantsPerStatus() {
    const { result: statusData, query: statusQuery } = useList<Applicant>({
        resource: "applicants",
        pagination: { pageSize: 1000 },
        meta: { select: "status" },
    });

    const statusCounts = Object.keys(STATUS_OPTIONS).reduce(
        (acc, status) => {
            acc[status] = statusData?.data?.filter((a: Applicant) => a.status === status).length ?? 0;
            return acc;
        },
        {} as Record<string, number>
    );

    return (
        <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
                <Typography variant="overline" color="text.secondary">
                    Applicants per Status
                </Typography>
                {statusQuery.isLoading ? (
                    <Box mt={1}>
                        <CircularProgress size={24} />
                    </Box>
                ) : (
                    <Stack direction="row" gap={3} mt={2} flexWrap="wrap">
                        {Object.entries(STATUS_OPTIONS).map(([key, label]) => (
                            <Box key={key} textAlign="center">
                                <Typography variant="h4" fontWeight="bold">
                                    {statusCounts[key]}
                                </Typography>
                                <Chip
                                    label={label}
                                    size="small"
                                    color={statusColor(key) as any}
                                    sx={{ mt: 0.5 }}
                                />
                            </Box>
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    )
}