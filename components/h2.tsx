import type { ComponentChildren, JSX } from "preact";

interface H2Props {
	children: ComponentChildren;
	class?: string;
}

export function H2({ children, class: className = "" }: H2Props): JSX.Element {
	return (
		<h2
			class={`text-2xl sm:text-3xl font-bold text-slate-900 text-center ${className}`.trim()}
		>
			{children}
		</h2>
	);
}
