import type { JSX } from "react";

export function App(): JSX.Element {
	return (
		<main className="min-h-screen bg-zinc-950 text-zinc-100">
			<div className="mx-auto max-w-4xl px-6 py-12">
				<header className="mb-16">
					<h1 className="text-4xl font-bold tracking-tight">Kriptovalidáció</h1>
					<p className="mt-4 text-lg text-zinc-400">
						A magyar kriptovaluta "validációs" törvények idővonala és következményei
					</p>
				</header>

				<section>
					<h2 className="mb-6 text-2xl font-semibold">Idővonal</h2>
					<p className="text-zinc-400">Hamarosan...</p>
				</section>
			</div>
		</main>
	);
}
