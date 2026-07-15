// Components
import { Typography, Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { DateField } from "@refinedev/mui";

// Hooks
import { useMemo } from "react";
import { useDataGrid } from "@refinedev/mui";

// Types
interface Props {
    id: string
}
import type { GridColDef } from "@mui/x-data-grid";
type Interview = {
    id: number;
    date: string;
    notes: string | null;
};

export default function RelatedInterviews({ id }: Props) {
    const { dataGridProps } = useDataGrid<Interview>({
        resource: "interviews",
        filters: {
            permanent: [{ field: "applicantId", operator: "eq", value: id }],
        },
        sorters: {
            initial: [{ field: "date", order: "asc" }],
        },
        meta: { select: "id, date, notes" },
    });

    const interviewColumns = useMemo<GridColDef[]>(
        () => [
            {
                field: "date",
                headerName: "Date",
                minWidth: 200,
                display: "flex",
                renderCell: ({ value }) => (value ? <DateField value={value} format="LLL" /> : "-"),
            },
            {
                field: "notes",
                headerName: "Notes",
                flex: 1,
                sortable: false,
                display: "flex",
                renderCell: ({ value }) => value ?? "-",
            },
        ],
        []
    );

    return (
        <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                    Related Interviews
                </Typography>
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    href={`/interviews/create?applicantId=${id}`}
                >
                    Schedule Interview
                </Button>
            </Box>
            <DataGrid
                {...dataGridProps}
                columns={interviewColumns}
                autoHeight
            />
        </Box>
    )
}