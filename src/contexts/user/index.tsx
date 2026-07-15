"use client";

import React, { createContext, useContext, type PropsWithChildren } from "react";
import { useCurrentUser, type AuthIdentity, type PublicUser } from "@hooks/useCurrentUser";

type UserContextType = {
	identity: AuthIdentity | null;
	user: PublicUser | null;
	isLoading: boolean;
	isError: boolean;
	error: unknown;
};

export const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const value = useCurrentUser();

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
