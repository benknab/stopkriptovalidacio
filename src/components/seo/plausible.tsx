import type { JSX } from "react";

export function Plausible(): JSX.Element {
	return (
		<script
			defer
			data-domain="kriptovalidacio.hu"
			src="https://plausible.io/js/script.js"
		/>
	);
}
