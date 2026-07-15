// Components
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { DateField } from "@refinedev/mui";

// Hooks
import { useList } from "@refinedev/core";

// Hooks
import { useUser } from "@contexts/user";

// Utilities
import { toTitleCase, statusColor } from "@utils/string";

// Types
import { Applicant } from "@components/dashboard/types";

export default function RecentApplicants() {
    const { user } = useUser();
    const { result: recentData, query: recentQuery } = useList<Applicant>({
        resource: "applicants",
        pagination: { pageSize: 10 },
        sorters: [{ field: "createdAt", order: "desc" }],
        meta: { select: "id, fullName, email, status, createdAt" },
    });

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="overline" color="text.secondary">
                    Recent Applicants
                </Typography>
                {recentQuery.isLoading ? (
                    <Box mt={2}>
                        <CircularProgress size={24} />
                    </Box>
                ) : recentData?.data?.length === 0 ? (
                    <Typography mt={2} color="text.secondary">
                        No applicants in the last 7 days.
                    </Typography>
                ) : (
                    <Stack mt={2} divider={<Divider />}>
                        {recentData?.data?.map((applicant: Applicant) => (
                            <Box
                                key={applicant.id}
                                py={1.5}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                gap={2}
                            >
                                <Box>
                                    <Typography fontWeight="bold">{applicant.fullName}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {applicant.email}
                                    </Typography>
                                </Box>
                                <Stack direction="row" gap={2} alignItems="center">
                                    {(user?.accessLevel ?? 0) > 1 && (
                                        <Chip
                                            label={toTitleCase(applicant.status ?? "-")}
                                            size="small"
                                            color={statusColor(applicant.status) as any}
                                        />
                                    )}
                                    <Typography component="div" variant="body2" color="text.secondary" whiteSpace="nowrap">
                                        <DateField value={applicant.createdAt} />
                                    </Typography>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    )
}