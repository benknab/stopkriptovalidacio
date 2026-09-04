import type { JSX } from "preact";

const PLAUSIBLE_ID = "sWCSUmeh0pueFceN2lmVp";
const UMAMI_WEBSITE_ID = "241d8f15-baee-4931-9a37-c953d657fed9";

export function Analytics(): JSX.Element {
	return (
		<>
			<script async src={`https://plausible.io/js/pa-${PLAUSIBLE_ID}.js`} />
			<script>
				{`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`}
			</script>
			<script
				defer
				src="https://tomato.hospitablealpaca.com/x.js"
				data-website-id={UMAMI_WEBSITE_ID}
			/>
		</>
	);
}
