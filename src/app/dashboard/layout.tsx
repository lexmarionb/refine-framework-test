// Components
import BaseLayout from "@components/layout";

// Types
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
	return <BaseLayout>{children}</BaseLayout>;
}
