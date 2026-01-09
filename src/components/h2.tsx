import type { JSX, ReactNode } from "react";

interface H2Props {
	children: ReactNode;
	className?: string;
}

export function H2({ children, className = "" }: H2Props): JSX.Element {
	return (
		<h2
			className={`text-2xl sm:text-3xl font-bold text-slate-900 text-center ${className}`.trim()}
		>
			{children}
		</h2>
	);
}
