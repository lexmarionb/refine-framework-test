"use client";

// Hooks
import { useUser } from "@contexts/user";

// Components
import { Box, Grid, Typography } from "@mui/material";
import TotalApplicants from "@components/dashboard/totalapplicants";
import ApplicantsPerStatus from "@components/dashboard/applicantsperstatus";
import RecentApplicants from "@components/dashboard/recentapplicants";
import RecentInterviews from "@components/dashboard/recentinterviews";

export default function DashboardPage() {
	const { user } = useUser();

	return (
		<Box p={3}>
			<Typography variant="h5" fontWeight="bold" mb={3}>
				Dashboard
			</Typography>

			<Grid container spacing={3}>
				{/* Total Applicants */}
				<Grid item xs={12} sm={4}>
					<TotalApplicants />
				</Grid>

				{/* Applicants per Status */}
				{(user?.accessLevel ?? 0) > 1 && (
					<Grid item xs={12} sm={8}>
						<ApplicantsPerStatus />
					</Grid>
				)}

				{/* Recent Applicants */}
				<Grid item xs={12}>
					<RecentApplicants />
				</Grid>

				{/* Upcoming Interviews */}
				{(user?.accessLevel ?? 0) > 1 && (
					<Grid item xs={12}>
						<RecentInterviews />
					</Grid>
				)}
			</Grid>
		</Box>
	);
}
