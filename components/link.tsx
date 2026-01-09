import type { ComponentChildren, JSX } from "preact";
import { twMerge } from "tailwind-merge";

interface LinkProps {
	href: string;
	children: ComponentChildren;
	class?: string;
}

export function Link({ href, children, class: className }: LinkProps): JSX.Element {
	return (
		<a href={href} class={twMerge("text-brand hover:text-brand-hover transition-colors", className)}>
			{children}
		</a>
	);
}
