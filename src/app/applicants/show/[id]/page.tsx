"use client";

// Hooks
import { useShow } from "@refinedev/core";
import { useParams } from "next/navigation";

// Contexts
import { useUser } from "@contexts/user";

// Components
import { Stack, Typography, Divider, Chip, Box } from "@mui/material";
import { DateField, NumberField, Show, TextFieldComponent as TextField, useDataGrid } from "@refinedev/mui";

// Utilities
import { toTitleCase } from "@utils/string";

// Types
import RelatedInterviews from "@app/applicants/show/[id]/interviews";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<Box>
			<Typography variant="caption" color="text.secondary" fontWeight="bold" textTransform="uppercase">
				{label}
			</Typography>
			<Box mt={0.5}>{children}</Box>
		</Box>
	);
}

export default function ApplicantsShow() {
	const { id } = useParams<{ id: string }>();
	const { user } = useUser();
	const isRecruiter = (user?.accessLevel ?? 0) < 2;

	const { result: record, query } = useShow({
		meta: { select: "*" },
	});

	const { isLoading } = query;

	return (
		<Show isLoading={isLoading}>
			<Stack gap={3} divider={<Divider />}>
				{/* Personal Info */}
				<Box>
					<Typography variant="subtitle1" fontWeight="bold" mb={2}>
						Personal Information
					</Typography>
					<Stack gap={2}>
						<Field label="Full Name">
							<TextField value={record?.fullName} />
						</Field>
						<Field label="Email">
							<TextField value={record?.email} />
						</Field>
						<Field label="Phone">
							<TextField value={record?.phone ?? "-"} />
						</Field>
					</Stack>
				</Box>

				{/* Application Details */}
				<Box>
					<Typography variant="subtitle1" fontWeight="bold" mb={2}>
						Application Details
					</Typography>
					<Stack gap={2}>
						{! isRecruiter && (
							<Field label="Status">
								<Chip
									label={toTitleCase(record?.status ?? "-")}
									size="small"
									color={
										record?.status === "hired"
											? "success"
											: record?.status === "interviewing"
												? "warning"
												: "default"
									}
								/>
							</Field>
						)}
						<Field label="Years of Experience">
							{record?.yearsOfExperience != null ? <NumberField value={record.yearsOfExperience} /> : "-"}
						</Field>
						<Field label="Expected Salary">
							{record?.expectedSalary != null ? (
								<NumberField
									value={record.expectedSalary}
									options={{ style: "currency", currency: "USD" }}
								/>
							) : (
								"-"
							)}
						</Field>
						<Field label="Available Start Date">
							{record?.availableStartDate ? <DateField value={record.availableStartDate} /> : "-"}
						</Field>
					</Stack>
				</Box>

				{/* Meta */}
				<Box>
					<Typography variant="subtitle1" fontWeight="bold" mb={2}>
						Meta
					</Typography>
					<Stack gap={2}>
						<Field label="ID">
							<TextField value={String(record?.id ?? "")} />
						</Field>
						<Field label="Created At">
							<DateField value={record?.createdAt} />
						</Field>
					</Stack>
				</Box>

				{/* Related Interviews */}
				{! isRecruiter && <RelatedInterviews id={id} />}
			</Stack>
		</Show>
	);
}
