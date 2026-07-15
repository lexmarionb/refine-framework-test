"use client";

// Hooks
import { useShow } from "@refinedev/core";
import { useParams } from "next/navigation";

// Components
import { Stack, Typography, Divider, Box } from "@mui/material";
import { DateField, Show, TextFieldComponent as TextField } from "@refinedev/mui";

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

export default function InterviewsShow() {
	const { id } = useParams<{ id: string }>();

	const { result: record, query } = useShow({
		resource: "interviews",
		id,
		meta: { select: "*, applicants(id, fullName, email)" },
	});

	const { isLoading } = query;

	return (
		<Show isLoading={isLoading}>
			<Stack gap={3} divider={<Divider />}>
				{/* Interview Details */}
				<Box>
					<Typography variant="subtitle1" fontWeight="bold" mb={2}>
						Interview Details
					</Typography>
					<Stack gap={2}>
						<Field label="Interview Date">
							{record?.date ? <DateField value={record.date} format="LLL" /> : "-"}
						</Field>
						<Field label="Notes">
							<Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
								{record?.notes ?? "-"}
							</Typography>
						</Field>
					</Stack>
				</Box>

				{/* Applicant */}
				<Box>
					<Typography variant="subtitle1" fontWeight="bold" mb={2}>
						Applicant
					</Typography>
					<Stack gap={2}>
						<Field label="Full Name">
							<TextField value={record?.applicants?.fullName ?? "-"} />
						</Field>
						<Field label="Email">
							<TextField value={record?.applicants?.email ?? "-"} />
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
			</Stack>
		</Show>
	);
}
