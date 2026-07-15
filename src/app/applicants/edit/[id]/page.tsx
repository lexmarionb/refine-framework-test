"use client";

// Hooks
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "next/navigation";

// Date Picker
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Components
import {
	Box,
	Chip,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { Edit } from "@refinedev/mui";
import { Controller } from "react-hook-form";

// Utilities
import { STATUS_OPTIONS } from "@utils/constants";
import {useUser} from "@contexts/user";

export default function ApplicantsEdit() {
	const { id } = useParams<{ id: string }>();

	const {
		saveButtonProps,
		refineCore: { formLoading },
		register,
		control,
		formState: { errors },
		setValue,
		watch,
	} = useForm({
		refineCoreProps: {
			id,
			meta: { select: "*" },
		},
	});

	const skills: string[] = watch("skills") ?? [];
	const { user } = useUser();
	const isAdmin = (user?.accessLevel ?? 0) > 2;

	return (
		<Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
			<Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }} autoComplete="off">
				<Typography variant="subtitle1" fontWeight="bold" mt={1}>
					Personal Information
				</Typography>

				<TextField
					{...register("fullName", { required: "Full name is required" })}
					error={!!errors.fullName}
					helperText={errors.fullName?.message as string}
					label="Full Name"
					fullWidth
					InputLabelProps={{ shrink: true }}
				/>
				<TextField
					{...register("email", {
						required: "Email is required",
						pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
					})}
					error={!!errors.email}
					helperText={errors.email?.message as string}
					label="Email"
					type="email"
					fullWidth
					InputLabelProps={{ shrink: true }}
				/>
				<TextField
					{...register("phone", { required: "Phone is required" })}
					error={!!errors.phone}
					helperText={errors.phone?.message as string}
					label="Phone"
					fullWidth
					InputLabelProps={{ shrink: true }}
				/>

				<Typography variant="subtitle1" fontWeight="bold" mt={1}>
					Application Details
				</Typography>

				<TextField
					{...register("appliedRole", { required: "Applied role is required" })}
					error={!!errors.appliedRole}
					helperText={errors.appliedRole?.message as string}
					label="Applied Role"
					fullWidth
					InputLabelProps={{ shrink: true }}
				/>
				<TextField
					{...register("yearsOfExperience", {
						required: "Years of experience is required",
						min: { value: 0, message: "Must be 0 or more" },
						valueAsNumber: true,
					})}
					error={!!errors.yearsOfExperience}
					helperText={errors.yearsOfExperience?.message as string}
					label="Years of Experience"
					type="number"
					fullWidth
					InputLabelProps={{ shrink: true }}
				/>
				<TextField
					{...register("expectedSalary", {
						min: { value: 0, message: "Must be 0 or more" },
						valueAsNumber: true,
					})}
					error={!!errors.expectedSalary}
					helperText={errors.expectedSalary?.message as string}
					label="Expected Salary"
					type="number"
					fullWidth
					InputLabelProps={{ shrink: true }}
				/>
				<Controller
					name="availableStartDate"
					control={control}
					rules={{ required: "Available start date is required" }}
					render={({ field }) => (
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								label="Available Start Date"
								value={field.value ? dayjs(field.value) : null}
								onChange={(date) => field.onChange(date ? date.format("YYYY-MM-DD") : null)}
								minDate={dayjs().add(1, "day")}
								slotProps={{
									textField: {
										fullWidth: true,
										error: !!errors.availableStartDate,
										helperText: errors.availableStartDate?.message as string,
									},
									inputAdornment: { position: "end" },
									popper: { placement: "bottom-end" },
								}}
							/>
						</LocalizationProvider>
					)}
				/>

				{isAdmin && (
					<Controller
						name="status"
						control={control}
						render={({ field }) => (
							<FormControl fullWidth error={!!errors.status}>
								<InputLabel shrink>Status</InputLabel>
								<Select {...field} value={field.value ?? ""} label="Status" notched>
									{Object.entries(STATUS_OPTIONS).map(([value, label]) => (
										<MenuItem key={value} value={value}>
											{label}
										</MenuItem>
									))}
								</Select>
								{errors.status && <FormHelperText>{errors.status.message as string}</FormHelperText>}
							</FormControl>
						)}
					/>
				)}

				<Box>
					<TextField
						label="Skills (press Enter to add)"
						fullWidth
						InputLabelProps={{ shrink: true }}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								const input = e.target as HTMLInputElement;
								const val = input.value.trim();
								if (val && !skills.includes(val)) {
									setValue("skills", [...skills, val]);
									input.value = "";
								}
							}
						}}
					/>
					<Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
						{skills ? skills.map((skill) => (
							<Chip
								key={skill}
								label={skill}
								onDelete={() =>
									setValue(
										"skills",
										skills.filter((s) => s !== skill)
									)
								}
							/>
						)) : null}
					</Stack>
					<input type="hidden" {...register("skills")} />
					{errors.skills && <FormHelperText error>{errors.skills.message as string}</FormHelperText>}
				</Box>

				<TextField
					{...register("notes")}
					label="Notes"
					multiline
					rows={4}
					fullWidth
					InputLabelProps={{ shrink: true }}
				/>
			</Box>
		</Edit>
	);
}
