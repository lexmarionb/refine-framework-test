"use client";

import type { AccessControlProvider } from "@refinedev/core";
import { supabaseBrowserClient } from "@utils/supabase/client";

export const accessControlProvider: AccessControlProvider = {
	can: async ({ resource }) => {
		if (resource === "interviews") {
			const { data: authData } = await supabaseBrowserClient.auth.getUser();
			if (!authData.user) return { can: false };

			const { data } = await supabaseBrowserClient
				.from("users")
				.select("accessLevel")
				.eq("authId", authData.user.id)
				.single();

			if (!data || data.accessLevel < 2) {
				return { can: false, reason: "Insufficient access level" };
			}
		}

		return { can: true };
	},
};
