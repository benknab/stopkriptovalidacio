import type { JSX, ReactNode } from "react";

interface DocumentProps {
	children: ReactNode;
	title?: string;
}

export function Document({ children, title = "Kriptovalidáció" }: DocumentProps): JSX.Element {
	return (
		<html lang="hu">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>{title}</title>
				<link rel="stylesheet" href="/public/styles.css" />
			</head>
			<body>{children}</body>
		</html>
	);
}
