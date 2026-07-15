"use client";

// Context
import { ColorModeContext } from "@contexts/color-mode";
import { useUser } from "@contexts/user";

// Hooks
import { useContext } from "react";

// Components
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { HamburgerMenu, RefineThemedLayoutHeaderProps } from "@refinedev/mui";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";

// Types
import type { FC } from "react";

export const Header: FC<RefineThemedLayoutHeaderProps> = ({ sticky = true }) => {
	const { mode, setMode } = useContext(ColorModeContext);

	const { identity } = useUser();

	return (
		<AppBar position={sticky ? "sticky" : "relative"}>
			<Toolbar>
				<Stack direction="row" width="100%" justifyContent="flex-end" alignItems="center">
					<HamburgerMenu />
					<Stack direction="row" width="100%" justifyContent="flex-end" alignItems="center">
						<IconButton
							color="inherit"
							onClick={() => {
								setMode();
							}}
						>
							{mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
						</IconButton>

						{(identity?.avatar || identity?.name) && (
							<Stack direction="row" gap="16px" alignItems="center" justifyContent="center">
								{identity?.name && (
									<Typography
										sx={{
											display: {
												xs: "none",
												sm: "inline-block",
											},
										}}
										variant="subtitle2"
									>
										{identity?.name}
									</Typography>
								)}
								<Avatar src={identity?.avatar} alt={identity?.name} />
							</Stack>
						)}
					</Stack>
				</Stack>
			</Toolbar>
		</AppBar>
	);
};
