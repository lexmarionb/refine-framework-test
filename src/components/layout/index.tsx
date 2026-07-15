// Modules
import { redirect } from "next/navigation";
import { authProviderServer } from "@providers/auth-provider/auth-provider.server";
import { ThemedLayout } from "@refinedev/mui";

// Components
import { Header } from "@components/header";
import Sider from "@components/layout/sider";

// Types
import { PropsWithChildren } from "react";

export default async function Layout({ children }: Readonly<PropsWithChildren>) {
	const data = await getData();

	if (!data.authenticated) {
		return redirect(data?.redirectTo || "/login");
	}

	return (
		<ThemedLayout Header={Header} Sider={Sider}>
			{children}
		</ThemedLayout>
	);
}

async function getData() {
	const { authenticated, redirectTo } = await authProviderServer.check();

	return {
		authenticated,
		redirectTo,
	};
}
