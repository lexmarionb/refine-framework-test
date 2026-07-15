"use client";

// Hooks
import { useForm } from "@refinedev/react-hook-form";
import { useSelect, useUpdate, useDataProvider } from "@refinedev/core";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Hooks
import { useDebounce } from "@hooks/useDebounce";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Components
import { Autocomplete, Box, FormControl, TextField, Typography } from "@mui/material";
import { Create } from "@refinedev/mui";
import { Controller } from "react-hook-form";

export default function InterviewsCreate() {
	return (
		<Suspense>
			<InterviewsCreateContent />
		</Suspense>
	);
}

function InterviewsCreateContent() {
	const searchParams = useSearchParams();
	const preselectedApplicantId = searchParams.get("applicantId")
		? Number(searchParams.get("applicantId"))
		: undefined;

	const { mutate: updateApplicant } = useUpdate();
	const dataProvider = useDataProvider();
	const {
		saveButtonProps,
		refineCore: { formLoading },
		register,
		control,
		formState: { errors },
	} = useForm({
		refineCoreProps: {
			resource: "interviews",
			onMutationSuccess: async (data) => {
				const applicantId = data?.data?.applicantId;

				if (!applicantId) return;

				// Only upgrade status screening -> interviewing
				const { data: applicant } = await dataProvider().getOne({
					resource: "applicants",
					id: applicantId,
					meta: {
						select: "status",
					},
				});

				if (applicant?.status === "screening") {
					updateApplicant({
						resource: "applicants",
						id: applicantId,
						values: {
							status: "interviewing",
						},
						// We silently updated this so no notifications
						successNotification: false,
					});
				}
			},
		},
		defaultValues: {
			applicantId: preselectedApplicantId,
			date: undefined,
			notes: undefined,
		},
	});

	const [applicantSearch, setApplicantSearch] = useState("");
	const debouncedApplicantSearch = useDebounce(applicantSearch, 500);

	const {
		options: applicantOptions,
		query,
		onSearch,
	} = useSelect({
		resource: "applicants",
		optionLabel: "fullName",
		optionValue: "id",
		onSearch: (value) => [{ field: "fullName", operator: "contains", value }],
		pagination: { pageSize: 10 },
		defaultValue: preselectedApplicantId,
	});

	useEffect(() => {
		onSearch(debouncedApplicantSearch);
	}, [debouncedApplicantSearch, onSearch]);

	return (
		<Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
			<Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }} autoComplete="off">
				<Typography variant="subtitle1" fontWeight="bold" mt={1}>
					Interview Details
				</Typography>

				<Controller
					name="applicantId"
					control={control}
					rules={{ required: "Applicant is required" }}
					render={({ field }) => (
						<Autocomplete
							options={applicantOptions ?? []}
							loading={query?.isLoading}
							filterOptions={(x) => x}
							getOptionLabel={(option) => option.label}
							isOptionEqualToValue={(option, value) => option.value?.toString() === value?.toString()}
							value={
								applicantOptions?.find((o) => o.value?.toString() === field.value?.toString()) ?? null
							}
							onInputChange={(_, value, reason) => {
								if (reason === "input") {
									setApplicantSearch(value);
								}
							}}
							onChange={(_, selected) => {
								field.onChange(selected?.value ?? null);
								setApplicantSearch("");
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Applicant"
									fullWidth
									slotProps={{ inputLabel: { shrink: true } }}
									error={!!errors.applicantId}
									helperText={errors.applicantId?.message as string}
								/>
							)}
						/>
					)}
				/>

				<Controller
					name="date"
					control={control}
					rules={{ required: "Interview date is required" }}
					render={({ field }) => (
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DateTimePicker
								label="Interview Date & Time"
								value={field.value ? dayjs(field.value) : null}
								onChange={(val) => field.onChange(val ? val.toISOString() : null)}
								disablePast
								slotProps={{
									textField: {
										fullWidth: true,
										slotProps: { inputLabel: { shrink: true } },
										error: !!errors.date,
										helperText: errors.date?.message,
									},
									inputAdornment: { position: "end" },
									popper: { placement: "bottom-end" },
								}}
							/>
						</LocalizationProvider>
					)}
				/>

				<FormControl fullWidth>
					<TextField
						{...register("notes")}
						label="Notes"
						multiline
						rows={4}
						fullWidth
						slotProps={{ inputLabel: { shrink: true } }}
						error={!!errors.notes}
						helperText={errors.notes?.message}
					/>
				</FormControl>
			</Box>
		</Create>
	);
}
