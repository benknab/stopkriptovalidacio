import type { JSX } from "react";

export function Plausible(): JSX.Element {
	return (
		<>
			<script
				async
				src="https://plausible.io/js/pa-ADtpJacMmc0HXCZExXgKR.js"
			/>
			<script
				dangerouslySetInnerHTML={{
					__html:
						`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`,
				}}
			/>
		</>
	);
}
