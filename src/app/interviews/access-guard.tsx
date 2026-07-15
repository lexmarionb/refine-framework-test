"use client";

// Modules
import { redirect } from "next/navigation";

// Components
import { CanAccess } from "@refinedev/core";

// Types
import type { PropsWithChildren } from "react";

export default function InterviewsAccessGuard({ children }: PropsWithChildren) {
    return (
        <CanAccess
            resource="interviews"
            action="list"
            fallback={null}
            onUnauthorized={() => redirect("/dashboard")}
        >
            {children}
        </CanAccess>
    );
}
