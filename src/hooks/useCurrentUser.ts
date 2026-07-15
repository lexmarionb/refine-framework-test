"use client";

// Hooks
import { useGetIdentity, useList } from "@refinedev/core";

export type AuthIdentity = {
	id: string;
	name: string;
	email: string;
	avatar?: string;
};

export type PublicUser = {
	id: number;
	authId: string;
	accessLevel: number;
};

export function useCurrentUser() {
	const { data: identity, isLoading: identityLoading } = useGetIdentity<AuthIdentity>();

	const { result: data, query } = useList<PublicUser>({
		resource: "users",
		filters: [
			{
				field: "authId",
				operator: "eq",
				value: identity?.id,
			},
		],
		pagination: { pageSize: 1 },
		queryOptions: {
			enabled: !!identity?.id,
		},
	});

	const user = data?.data?.[0] ?? null;

	return {
		identity: identity ?? null,
		user,
		isLoading: identityLoading || query.isLoading,
		isError: query.isError,
		error: query.error,
	};
}
