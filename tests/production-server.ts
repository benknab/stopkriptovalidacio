import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { setTimeout } from "node:timers/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

export async function startProductionServer() {
	if (!existsSync("dist/client/index.html")) throw new Error("Run pnpm build before testing the static Pages export.");
	const reservation = createServer();
	await new Promise<void>((resolve) => reservation.listen(0, "127.0.0.1", resolve));
	const address = reservation.address();
	if (!address || typeof address === "string") throw new Error("Could not reserve a test port.");
	const port = address.port;
	await new Promise<void>((resolve, reject) => reservation.close((error) => (error ? reject(error) : resolve())));
	const server = spawn(
		process.execPath,
		[
			resolve("node_modules/wrangler/bin/wrangler.js"),
			"pages",
			"dev",
			"dist/client",
			"--ip",
			"127.0.0.1",
			"--port",
			String(port),
		],
		{
			env: { ...process.env, WRANGLER_SEND_METRICS: "false", BROWSER: "none" },
			stdio: ["ignore", "pipe", "pipe"],
		},
	);
	let output = "";
	server.stdout.on("data", (data: Buffer) => {
		output += data.toString();
	});
	server.stderr.on("data", (data: Buffer) => {
		output += data.toString();
	});
	const baseUrl = `http://127.0.0.1:${port}`;
	for (let attempt = 0; attempt < 400; attempt++) {
		try {
			const response = await fetch(`${baseUrl}/robots.txt`);
			if (response.ok)
				return {
					baseUrl,
					getOutput: () => output,
					stop: async () => {
						if (server.exitCode !== null) return;
						const exited = new Promise<void>((resolve) => server.once("exit", () => resolve()));
						server.kill("SIGTERM");
						await exited;
					},
				};
		} catch {
			/* Wait for the server to bind its port. */
		}
		if (server.exitCode !== null) throw new Error(`Production server exited: ${output}`);
		await setTimeout(50);
	}
	server.kill();
	throw new Error(`Production server did not start: ${output}`);
}
