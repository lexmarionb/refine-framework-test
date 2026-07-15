// Modules
import dayjs from "dayjs";

// Components
import { Box, Card, CardContent, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { DateField } from "@refinedev/mui";

// Hooks
import { useMemo } from "react";
import { useList } from "@refinedev/core";

// Types
import type { Interview } from "@components/dashboard/types";

export default function RecentInterviews() {
    const now = useMemo(() => dayjs().toISOString(), []);

    const { result: upcomingInterviewsData, query: upcomingInterviewsQuery } = useList<Interview>({
        resource: "interviews",
        pagination: { pageSize: 10 },
        sorters: [{ field: "date", order: "asc" }],
        filters: [
            { field: "date", operator: "gte", value: now },
        ],
        meta: { select: "id, date, notes, applicants(id, fullName)" },
    });

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="overline" color="text.secondary">
                    Upcoming Interviews
                </Typography>
                {upcomingInterviewsQuery.isLoading ? (
                    <Box mt={2}>
                        <CircularProgress size={24} />
                    </Box>
                ) : upcomingInterviewsData?.data?.length === 0 ? (
                    <Typography mt={2} color="text.secondary">
                        No interviews scheduled in the next 7 days.
                    </Typography>
                ) : (
                    <Stack mt={2} divider={<Divider />}>
                        {upcomingInterviewsData?.data?.map((interview: Interview) => (
                            <Box
                                key={interview.id}
                                py={1.5}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                gap={2}
                            >
                                <Box>
                                    <Typography fontWeight="bold">
                                        {interview.applicants?.fullName ?? "-"}
                                    </Typography>
                                    {interview.notes && (
                                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 400 }}>
                                            {interview.notes}
                                        </Typography>
                                    )}
                                </Box>
                                <Typography component="div" variant="body2" color="text.secondary" whiteSpace="nowrap">
                                    <DateField value={interview.date} format="LLL" />
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    )
}