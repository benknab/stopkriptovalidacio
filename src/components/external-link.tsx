import type { JSX, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ExternalLinkProps {
	href: string;
	children: ReactNode;
	className?: string;
}

export function ExternalLink({ href, children, className }: ExternalLinkProps): JSX.Element {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={twMerge("text-brand hover:text-brand-hover transition-colors", className)}
		>
			{children}
		</a>
	);
}
