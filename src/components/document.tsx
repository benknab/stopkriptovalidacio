import type { JSX, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { SupportedLanguage } from "../i18n/index.ts";

interface DocumentProps {
	children: ReactNode;
	lang: SupportedLanguage;
}

export function Document({ children, lang }: DocumentProps): JSX.Element {
	const { t } = useTranslation();

	return (
		<html lang={lang}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>{t("site.title")}</title>
				<link rel="stylesheet" href="/public/styles.css" />
			</head>
			<body>{children}</body>
		</html>
	);
}
