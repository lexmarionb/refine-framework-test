"use client";

// Modules
import { DataGrid } from "@mui/x-data-grid";

// Components
import { DateField, DeleteButton, EditButton, List, ShowButton, useDataGrid } from "@refinedev/mui";
import { Box, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// Hooks
import { useMemo, useState, useEffect } from "react";

// Types
import type { GridColDef } from "@mui/x-data-grid";
import type { CrudFilter } from "@refinedev/core";

// Hooks
import { useDebounce } from "@hooks/useDebounce";

export default function InterviewsList() {
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearch = useDebounce(searchQuery, 500);

	const { dataGridProps, setCurrentPage, setFilters } = useDataGrid({
	    resource: "interviews",
	    syncWithLocation: true,
	    sorters: {
	        initial: [{ field: "createdAt", order: "desc" }],
	    },
	    meta: {
	        // Use !inner join when searching so PostgREST performs an INNER JOIN,
	        // which excludes interviews with null/non-matching applicants.
	        select: debouncedSearch
	            ? "*, applicants!inner(id, fullName)"
	            : "*, applicants(id, fullName)",
	    },
	});

	useEffect(() => {
	    const f: CrudFilter[] = [];
	    if (debouncedSearch) {
	        f.push({ field: "applicants.fullName", operator: "contains", value: debouncedSearch });
	    }
	    setFilters(f, "replace");
	    setCurrentPage(1);
	}, [debouncedSearch]);

	const columns = useMemo<GridColDef[]>(
		() => [
			{
				field: "id",
				headerName: "ID",
				type: "number",
				minWidth: 50,
				display: "flex",
				align: "left",
				headerAlign: "left",
			},
			{
				field: "applicantId",
				headerName: "Applicant",
				minWidth: 200,
				flex: 1,
				display: "flex",
				sortable: false,
				renderCell: function render({ row }) {
				    return row?.applicants?.fullName ?? "-";
				},
			},
			{
				field: "date",
				headerName: "Interview Date",
				minWidth: 180,
				display: "flex",
				renderCell: function render({ value }) {
					return value ? <DateField value={value} format="LLL" /> : "-";
				},
			},
			{
				field: "notes",
				headerName: "Notes",
				minWidth: 250,
				flex: 1,
				display: "flex",
				sortable: false,
				renderCell: function render({ value }) {
					return value ?? "-";
				},
			},
			{
				field: "createdAt",
				headerName: "Created At",
				minWidth: 150,
				display: "flex",
				renderCell: function render({ value }) {
					return <DateField value={value} />;
				},
			},
			{
				field: "actions",
				headerName: "Actions",
				align: "right",
				headerAlign: "right",
				minWidth: 120,
				sortable: false,
				display: "flex",
				renderCell: function render({ row }) {
					return (
						<>
							<EditButton hideText recordItemId={row.id} />
							<ShowButton hideText recordItemId={row.id} />
							<DeleteButton hideText recordItemId={row.id} />
						</>
					);
				},
			},
		],
		[]
	);

	return (
		<List>
			<Box mb={2} display="flex" justifyContent="flex-end">
				<TextField
					size="small"
					placeholder="Search by applicant name..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon fontSize="small" />
							</InputAdornment>
						),
					}}
					sx={{ minWidth: 280 }}
				/>
			</Box>
			<DataGrid {...dataGridProps} columns={columns} />
		</List>
	);
}
