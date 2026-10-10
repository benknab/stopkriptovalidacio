import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "./__root.tsx";

export const Route = createFileRoute("/404")({
	head: () => ({ meta: [{ title: "404 | Stop Kriptovalidáció" }, { name: "robots", content: "noindex, nofollow" }] }),
	component: NotFound,
});
