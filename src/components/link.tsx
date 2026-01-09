import type { JSX, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface LinkProps {
	href: string;
	children: ReactNode;
	className?: string;
}

export function Link({ href, children, className }: LinkProps): JSX.Element {
	return (
		<a href={href} className={twMerge("text-brand hover:text-brand-hover transition-colors", className)}>
			{children}
		</a>
	);
}
