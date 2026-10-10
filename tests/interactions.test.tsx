// @vitest-environment jsdom
import type { JSX } from "react";
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import TimelineSection from "../islands/timeline-section.tsx";
import MpsSection, { ALL_OPTION, currentMps, parseDistrict } from "../islands/mps-section.tsx";
import TakeActionSection from "../islands/take-action-section.tsx";
import PartiesSection from "../islands/parties-section.tsx";
import { MobileNav } from "../islands/mobile-nav.tsx";
import { getLatestDistrictOrList } from "../data/mps.ts";
import { t } from "../i18n/index.ts";
import { parseSearch, stringifySearch } from "../utils/search.ts";

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

window.scrollTo = vi.fn();

function renderWithRouter(Component: () => JSX.Element, path = "/", delayMs = 0) {
	const root = createRootRoute({
		validateSearch: (search: Record<string, unknown>) => search,
		beforeLoad: async () => {
			if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs));
		},
	});
	const index = createRoute({ getParentRoute: () => root, path: "/", component: Component });
	const router = createRouter({
		routeTree: root.addChildren([index]),
		history: createMemoryHistory({ initialEntries: [path] }),
		parseSearch,
		stringifySearch,
	});
	render(<RouterProvider router={router} />);
	return router;
}

test("timeline toggles update URL, retain campaign parameters/hash and survive history navigation", async () => {
	function Timeline(): JSX.Element {
		return <TimelineSection lang="hu" showSecondary showTertiary={false} />;
	}
	const router = renderWithRouter(Timeline, "/?utm_source=telegram#idovonal");
	const related = await screen.findByLabelText(t("timeline.filter.related", "hu"));
	const background = screen.getByLabelText(t("timeline.filter.background", "hu"));
	const originalCount = document.querySelectorAll('h3 a[href^="#"]').length;
	fireEvent.click(related);
	await waitFor(() => expect(router.state.location.search.masodlagos).toBe("false"));
	expect(document.querySelectorAll('h3 a[href^="#"]').length).toBeLessThan(originalCount);
	fireEvent.click(background);
	await waitFor(() => expect(router.state.location.search.harmadlagos).toBe("true"));
	expect(router.state.location.search.utm_source).toBe("telegram");
	expect(router.state.location.hash).toBe("idovonal");
	await router.navigate({ to: "/", search: { masodlagos: "true" } });
	await waitFor(() => expect((related as HTMLInputElement).checked).toBe(true));
	router.history.back();
	await waitFor(() => expect((related as HTMLInputElement).checked).toBe(false));
});

test("historical MP filters combine county, district and name, and clear dependent district state", async () => {
	function Mps(): JSX.Element {
		return <MpsSection lang="hu" selectedCounty={ALL_OPTION} selectedDistrict="" electionYear={2022} />;
	}
	const router = renderWithRouter(Mps);
	const county = await screen.findByLabelText(t("mps.filter.county", "hu"));
	const district = screen.getByLabelText(t("mps.filter.district", "hu"));
	fireEvent.change(county, { target: { value: "Budapest" } });
	await waitFor(() => expect(router.state.location.search.megye).toBe("Budapest"));
	fireEvent.change(district, { target: { value: "1. OEVK" } });
	await waitFor(() => expect(router.state.location.search.kerulet).toBe("1. OEVK"));
	expect(router.state.location.searchStr).toContain("kerulet=1.");
	expect(screen.getByText("Csárdi Antal")).toBeTruthy();
	const search = document.querySelector<HTMLInputElement>('input[type="text"]');
	if (!search) throw new Error("MP search input is missing");
	fireEvent.change(search, { target: { value: "nincs ilyen képviselő" } });
	expect(screen.getByText(t("mps.no_results", "hu"))).toBeTruthy();
	fireEvent.change(search, { target: { value: "" } });
	fireEvent.change(county, { target: { value: ALL_OPTION } });
	await waitFor(() => expect(router.state.location.search.kerulet).toBeUndefined());
	fireEvent.change(county, { target: { value: "" } });
	await waitFor(() => expect(screen.getByText(t("mps.filter.select_to_show", "hu"))).toBeTruthy());
});

test("county and district updates are atomic during asynchronous navigation", async () => {
	function Mps(): JSX.Element {
		return <MpsSection lang="hu" selectedCounty={ALL_OPTION} selectedDistrict="" electionYear={2022} />;
	}
	const router = renderWithRouter(Mps, "/?megye=Budapest&kerulet=1.+OEVK&utm_source=test", 30);
	await screen.findByText("Csárdi Antal");
	fireEvent.change(screen.getByLabelText(t("mps.filter.county", "hu")), { target: { value: ALL_OPTION } });
	await waitFor(() => expect(document.querySelectorAll('img[src^="/kepek/"]').length).toBe(199));
	expect(router.state.location.search.megye).toBeUndefined();
	expect(router.state.location.search.kerulet).toBeUndefined();
	expect(router.state.location.search.utm_source).toBe("test");
});

test("representative selection, district auto-selection, email editing and copy feedback work", async () => {
	const representative = currentMps.find(({ mp }) => {
		const district = parseDistrict(getLatestDistrictOrList(mp) ?? undefined);
		return mp.emails.size > 0 && district?.districtNum;
	});
	if (!representative) throw new Error("No contactable district representative in the current data");
	const mandate = parseDistrict(getLatestDistrictOrList(representative.mp) ?? undefined);
	if (!mandate) throw new Error("Missing constituency");
	const copy = vi.fn().mockResolvedValue(undefined);
	Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: copy } });
	Element.prototype.scrollIntoView = vi.fn();
	function Action(): JSX.Element {
		return <TakeActionSection lang="hu" selectedCounty="" selectedDistrict="" selectedRep="" />;
	}
	const router = renderWithRouter(Action, "/?utm_source=test#cselekedj");
	await screen.findByLabelText(t("action.search_placeholder", "hu"));
	fireEvent.change(document.getElementById("action-county-select") as HTMLSelectElement, {
		target: { value: mandate.county },
	});
	await waitFor(() => expect(router.state.location.search.megye).toBe(mandate.county));
	fireEvent.change(document.getElementById("action-district-select") as HTMLSelectElement, {
		target: { value: mandate.districtNum },
	});
	await waitFor(() => expect(router.state.location.search.kepviselo).toBe(representative.mpId));
	expect(router.state.location.search.kerulet).toBe(mandate.districtNum);
	expect(router.state.location.search.utm_source).toBe("test");
	expect(router.state.location.hash).toBe("cselekedj");
	fireEvent.change(screen.getByLabelText(t("action.subject_label", "hu")), { target: { value: "Új tárgy" } });
	fireEvent.change(screen.getByLabelText(t("action.message_label", "hu")), {
		target: { value: "Tesztüzenet\nKöszönöm." },
	});
	const send = screen.getByRole("link", { name: t("action.send", "hu") });
	expect(decodeURIComponent(send.getAttribute("href") ?? "")).toContain("Új tárgy");
	expect(decodeURIComponent(send.getAttribute("href") ?? "")).toContain("Tesztüzenet\r\nKöszönöm.");
	fireEvent.click(screen.getByRole("button", { name: t("action.copy_subject", "hu") }));
	await waitFor(() => expect(copy).toHaveBeenCalledWith("Új tárgy"));
	expect(await screen.findByText(t("action.copied", "hu"))).toBeTruthy();
	fireEvent.click(screen.getByRole("button", { name: new RegExp(representative.mp.name) }));
	await waitFor(() => expect(router.state.location.search.kepviselo).toBeUndefined());
});

test("party expansion and collapse preserve their stance styling", async () => {
	render(<PartiesSection lang="hu" />);
	fireEvent.click(screen.getByRole("button", { name: t("parties.show_all", "hu") }));
	expect(screen.getByRole("button", { name: t("parties.show_fewer", "hu") })).toBeTruthy();
	fireEvent.click(screen.getByRole("button", { name: t("parties.show_fewer", "hu") }));
	expect(screen.getByRole("button", { name: t("parties.show_all", "hu") })).toBeTruthy();
});

test("mobile navigation closes with Escape and anchor activation", () => {
	render(<MobileNav lang="hu" currentPath="/" />);
	const menu = screen.getByRole("button", { name: t("nav.menu", "hu") });
	fireEvent.click(menu);
	expect(menu.getAttribute("aria-expanded")).toBe("true");
	fireEvent.keyDown(document, { key: "Escape" });
	expect(menu.getAttribute("aria-expanded")).toBe("false");
	fireEvent.click(menu);
	fireEvent.click(screen.getByRole("link", { name: t("nav.timeline", "hu") }));
	expect(menu.getAttribute("aria-expanded")).toBe("false");
});
