import type { JSX } from "preact";

const UMAMI_WEBSITE_ID = "241d8f15-baee-4931-9a37-c953d657fed9";

export function Analytics(): JSX.Element {
	return (
		<script
			defer
			src="https://tomato.hospitablealpaca.com/x.js"
			data-website-id={UMAMI_WEBSITE_ID}
		/>
	);
}
