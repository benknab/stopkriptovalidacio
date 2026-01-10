import { App, staticFiles } from "fresh";
import type { JSX } from "preact";
import { Plausible } from "./components/seo/plausible.tsx";
import { define, type State } from "./utils.ts";

export const app = new App<State>();

app.use(staticFiles());

// Logger middleware
const loggerMiddleware = define.middleware((ctx) => {
	console.log(`${ctx.req.method} ${ctx.req.url}`);
	return ctx.next();
});
app.use(loggerMiddleware);

// App wrapper with common head elements
function AppWrapper({ Component }: { Component: () => JSX.Element }): JSX.Element {
	return (
		<html>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
				<Plausible />
			</head>
			<body>
				<Component />
			</body>
		</html>
	);
}
app.appWrapper(AppWrapper);

// Include file-system based routes here
app.fsRoutes();
