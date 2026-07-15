// Components
import { Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";

// Types
import type { ReactNode } from "react";

export default function StatCard({ title, value, isLoading }: { title: string; value: ReactNode; isLoading: boolean }) {
    return (
        <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
                <Typography variant="overline" color="text.secondary">
                    {title}
                </Typography>
                <Box mt={1}>
                    {isLoading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <Typography variant="h4" fontWeight="bold">
                            {value}
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}