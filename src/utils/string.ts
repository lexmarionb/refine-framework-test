export function toTitleCase(str: string): string {
	return str.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

export function statusColor(status: string) {
	if (status === "hired") return "success";
	if (status === "interviewing") return "warning";
	return "default";
}