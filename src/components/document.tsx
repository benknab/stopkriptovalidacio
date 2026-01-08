import type { JSX, ReactNode } from "react";
import type { SupportedLanguage } from "../i18n/index.ts";
import type { PageId } from "../constants/seo.ts";
import { SeoHead } from "./seo/index.ts";

interface DocumentProps {
	children: ReactNode;
	lang: SupportedLanguage;
	pageId: PageId;
	path: string;
}

export function Document({ children, lang, pageId, path }: DocumentProps): JSX.Element {
	return (
		<html lang={lang}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<SeoHead lang={lang} pageId={pageId} path={path} />
				<link rel="stylesheet" href="/public/styles.css" />
			</head>
			<body>{children}</body>
		</html>
	);
}
