import type { ComponentChildren, JSX } from "preact";
import { twMerge } from "tailwind-merge";

interface ExternalLinkProps {
	href: string;
	children: ComponentChildren;
	class?: string;
}

export function ExternalLink({ href, children, class: className }: ExternalLinkProps): JSX.Element {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			class={twMerge("text-brand hover:text-brand-hover transition-colors", className)}
		>
			{children}
		</a>
	);
}
