// Components
import BaseLayout from "@components/layout";
import InterviewsAccessGuard from "./access-guard";

// Types
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
    return (
        <BaseLayout>
            <InterviewsAccessGuard>{children}</InterviewsAccessGuard>
        </BaseLayout>
    );
}
