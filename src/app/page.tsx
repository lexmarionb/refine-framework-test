"use client";

// Modules
import { Suspense } from "react";
import { Authenticated } from "@refinedev/core";

// Components
import Dashboard from "@components/layout/dashboard";

export default function IndexPage() {
	return (
		<Suspense>
			<Authenticated key="home-page">
				<Dashboard />
			</Authenticated>
		</Suspense>
	);
}
