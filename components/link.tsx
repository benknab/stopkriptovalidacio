import type { ReactNode, JSX } from "react";
import { twMerge } from "tailwind-merge";
import type { SupportedLanguage } from "../i18n/index.ts";
import { localizePath } from "../utils/localized-path.ts";

interface LinkProps {
	href: string;
	children: ReactNode;
	className?: string;
	lang?: SupportedLanguage;
}

export function Link({ href, children, className, lang = "hu" }: LinkProps): JSX.Element {
	return (
		<a
			href={localizePath(href, lang)}
			className={twMerge("text-brand hover:text-brand-hover transition-colors", className)}
		>
			{children}
		</a>
	);
}
