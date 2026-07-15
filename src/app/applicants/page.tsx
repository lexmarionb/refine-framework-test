"use client";

// Modules
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";

// Components
import { DateField, DeleteButton, EditButton, List, ShowButton, useDataGrid } from "@refinedev/mui";
import {
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Box,
	SelectChangeEvent,
	TextField,
	InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// Hooks
import { useMemo, useState, useEffect } from "react";
import { useUser } from "@contexts/user";

// Types
import type { GridColDef } from "@mui/x-data-grid";
import type { CrudFilter } from "@refinedev/core";

// Utils
import { toTitleCase } from "@utils/string";
import { STATUS_OPTIONS } from "@utils/constants";

// Hooks
import { useDebounce } from "@hooks/useDebounce";

export default function ApplicantsList() {
	const { user } = useUser();
	const isAdmin = (user?.accessLevel ?? 0) > 2;
	const [statusFilter, setStatusFilter] = useState<keyof typeof STATUS_OPTIONS | "all">("all");
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearch = useDebounce(searchQuery, 500);

    const { dataGridProps, setCurrentPage, setFilters } = useDataGrid({
        syncWithLocation: true,
        sorters: {
            initial: [{ field: "createdAt", order: "desc" }],
        },
        meta: {
            select: "*",
        },
    });

	useEffect(() => {
		applyFilters(debouncedSearch, statusFilter);
	}, [debouncedSearch, statusFilter]);

	const applyFilters = (search: string, status: string) => {
		const f: CrudFilter[] = [];
		if (status && status !== "all") {
			f.push({ field: "status", operator: "eq", value: status });
		}
		if (search) {
			f.push({ field: "fullName", operator: "contains", value: search });
		}
		setFilters(f, "replace");
		setCurrentPage(1);
	};

	const columns = useMemo<GridColDef[]>(
		() => [
			{
				field: "id",
				headerName: "ID",
				type: "number",
				minWidth: 30,
				display: "flex",
				align: "left",
				headerAlign: "left",
			},
			{
				field: "fullName",
				headerName: "Full Name",
				minWidth: 200,
				display: "flex",
				flex: 1,
			},
			{
				field: "email",
				headerName: "Email",
				minWidth: 300,
				display: "flex",
				renderCell: function render({ value }) {
					if (!value) return "-";
					return (
						<Typography component="p" whiteSpace="pre" overflow="hidden" textOverflow="ellipsis">
							{value}
						</Typography>
					);
				},
			},
			{
				field: "phone",
				headerName: "Phone",
				minWidth: 140,
				display: "flex",
				sortable: false,
				renderCell: function render({ value }) {
					return value || "-";
				},
			},
			{
				field: "yearsOfExperience",
				headerName: "Years of Exp.",
				type: "number",
				minWidth: 120,
				display: "flex",
				align: "left",
				headerAlign: "left",
				renderCell: function render({ value }) {
					return value != null ? value : "-";
				},
			},
			{
				field: "expectedSalary",
				headerName: "Expected Salary",
				type: "number",
				minWidth: 150,
				display: "flex",
				align: "left",
				headerAlign: "left",
				renderCell: function render({ value }) {
					return value != null ? value.toLocaleString() : "-";
				},
			},
			{
				field: "availableStartDate",
				headerName: "Available From",
				minWidth: 130,
				display: "flex",
				renderCell: function render({ value }) {
					return value ? <DateField value={value} /> : "-";
				},
			},
			...(isAdmin
				? [
						{
							field: "status",
							headerName: "Status",
							minWidth: 80,
							display: "flex" as const,
							sortable: false,
							renderCell: function render({ value }: { value: string }) {
								return toTitleCase(value || "-");
							},
						},
					]
				: []) as GridColDef[],
			{
				field: "createdAt",
				headerName: "Created at",
				minWidth: 120,
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
							{isAdmin && <DeleteButton hideText recordItemId={row.id} />}
						</>
					);
				},
			},
		],
		[isAdmin]
	);

	return (
		<List>
			<Box mb={2} display="flex" gap={2} alignItems="center" justifyContent="flex-end">
				<TextField
					size="small"
					placeholder="Search by name..."
					value={searchQuery}
					onChange={(e) => {
						setSearchQuery(e.target.value);
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon fontSize="small" />
							</InputAdornment>
						),
					}}
					sx={{ minWidth: 240 }}
				/>
				{isAdmin && (
					<FormControl size="small" sx={{ minWidth: 180 }}>
						<InputLabel>Status</InputLabel>
						<Select
							value={statusFilter}
							label="Status"
							onChange={(e: SelectChangeEvent) => {
								const value = (e.target.value as keyof typeof STATUS_OPTIONS) || "all";
								setStatusFilter(value);
								applyFilters(searchQuery, value);
							}}
							displayEmpty
						>
							<MenuItem value="all">All</MenuItem>
							{Object.keys(STATUS_OPTIONS).map((s) => (
								<MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>
									{STATUS_OPTIONS[s as keyof typeof STATUS_OPTIONS]}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)}
			</Box>
			<DataGrid {...dataGridProps} columns={columns} />
		</List>
	);
}
