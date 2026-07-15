// Components
import StatCard from "@components/dashboard/statcard";

// Hooks
import { useList } from "@refinedev/core";

// Types
import type { Applicant } from "@components/dashboard/types";

export default function TotalApplicants() {
    const { result: totalData, query: totalQuery } = useList<Applicant>({
        resource: "applicants",
        pagination: { pageSize: 1 },
        meta: { select: "id" },
    });

    return <StatCard title="Total Applicants" value={totalData?.total ?? 0} isLoading={totalQuery.isLoading} />
}