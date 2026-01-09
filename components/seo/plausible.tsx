import type { JSX } from "preact";

export function Plausible(): JSX.Element {
	return (
		<>
			<script
				async
				src="https://plausible.io/js/pa-ADtpJacMmc0HXCZExXgKR.js"
			/>
			<script>
				{`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`}
			</script>
		</>
	);
}
