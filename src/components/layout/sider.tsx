"use client";

// Modules
import { ThemedSider } from "@refinedev/mui";
import { CanAccess, useLink, useMenu, useTranslate } from "@refinedev/core";

// Components
import Tooltip from "@mui/material/Tooltip";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Dashboard from "@mui/icons-material/Dashboard";
import ListItemText from "@mui/material/ListItemText";

// Hooks
import { useThemedLayoutContext } from "@refinedev/mui";

// Types
import type { ReactNode } from "react";

export default function Sider() {
	const translate = useTranslate();
	const { selectedKey } = useMenu();
	const Link = useLink();
	const { siderCollapsed, setMobileSiderOpen } = useThemedLayoutContext();

	// Copied from @refinedev/mui package - themedLayout sider
	const dashboard = (
		<CanAccess resource="dashboard" action="list">
			<Tooltip
				title={translate("dashboard.title", "Dashboard")}
				placement="right"
				disableHoverListener={!siderCollapsed}
				arrow
			>
				<Link
					to="/dashboard"
					style={{ textDecoration: "none" }}
					onClick={() => {
						setMobileSiderOpen(false);
					}}
				>
					<ListItemButton
						selected={selectedKey === "/dashboard"}
						sx={{
							pl: 2,
							py: 1,
							justifyContent: "center",
							color: selectedKey === "/dashboard" ? "primary.main" : "text.primary",
						}}
					>
						<ListItemIcon
							sx={{
								justifyContent: "center",
								minWidth: "24px",
								transition: "margin-right 0.3s",
								marginRight: siderCollapsed ? "0px" : "12px",
								color: "currentColor",
								fontSize: "14px",
							}}
						>
							<Dashboard />
						</ListItemIcon>
						<ListItemText
							primary={translate("dashboard.title", "Dashboard")}
							primaryTypographyProps={{
								noWrap: true,
								fontSize: "14px",
							}}
						/>
					</ListItemButton>
				</Link>
			</Tooltip>
		</CanAccess>
	);

	const render = ({ items, logout }: { items: ReactNode[]; logout: ReactNode }) => {
		return (
			<>
				{dashboard}
				{items}
				{logout}
			</>
		);
	};

	return <ThemedSider render={render} />;
}
