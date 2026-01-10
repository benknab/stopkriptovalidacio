import { useSignal } from "@preact/signals";
import type { JSX } from "preact";
import { useEffect } from "preact/hooks";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { LanguageSwitch } from "../components/language-switch.tsx";

const INITIAL_CLOSED = false;

interface MobileNavProps {
	lang: SupportedLanguage;
	currentPath: string;
}

interface NavLinkProps {
	anchor: string;
	currentPath: string;
	children: string;
	onClick: () => void;
}

function NavLink({ anchor, currentPath, children, onClick }: NavLinkProps): JSX.Element {
	// Use same-page anchor if on home, otherwise full path
	const isHomePage = currentPath === "/" || currentPath.startsWith("/?");
	const href = isHomePage ? `#${anchor}` : `/#${anchor}`;

	return (
		<a
			href={href}
			onClick={onClick}
			class="block py-3 px-4 text-lg font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
		>
			{children}
		</a>
	);
}

export function MobileNav({ lang, currentPath }: MobileNavProps): JSX.Element {
	const isOpen = useSignal(INITIAL_CLOSED);

	function open(): void {
		isOpen.value = true;
	}

	function close(): void {
		isOpen.value = false;
	}

	// Handle escape key
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent): void {
			if (e.key === "Escape" && isOpen.value) {
				close();
			}
		}

		if (isOpen.value) {
			globalThis.document.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			globalThis.document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen.value]);

	return (
		<>
			{/* Hamburger Button */}
			<button
				type="button"
				onClick={open}
				class="sm:hidden flex items-center justify-center w-11 h-11 -mr-2 text-slate-600 hover:text-slate-900 transition-colors"
				aria-label={t("nav.menu", lang)}
				aria-expanded={isOpen.value}
			>
				<svg
					class="w-6 h-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width={2}
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>

			{/* Overlay - opens from top */}
			{isOpen.value && (
				<div class="fixed inset-0 z-50 sm:hidden">
					{/* Backdrop */}
					<div
						class="absolute inset-0 bg-black/50"
						onClick={close}
						aria-hidden="true"
					/>

					{/* Menu panel - full screen */}
					<nav
						class="absolute inset-0 bg-white flex flex-col"
						aria-label={t("nav.menu", lang)}
					>
						{/* Header with close button */}
						<div class="flex items-center justify-between px-4 py-4 border-b border-slate-100">
							<span class="text-xl font-bold text-slate-900">
								Stop Kriptovalidáció
							</span>
							<button
								type="button"
								onClick={close}
								class="flex items-center justify-center w-11 h-11 -mr-2 text-slate-600 hover:text-slate-900 transition-colors"
								aria-label={t("nav.close", lang)}
							>
								<svg
									class="w-6 h-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width={2}
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						{/* Navigation Links */}
						<div class="py-2">
							<NavLink anchor="attekintes" currentPath={currentPath} onClick={close}>
								{t("nav.overview", lang)}
							</NavLink>
							<NavLink anchor="tozsdek" currentPath={currentPath} onClick={close}>
								{t("nav.exchanges", lang)}
							</NavLink>
							<NavLink anchor="idovonal" currentPath={currentPath} onClick={close}>
								{t("nav.timeline", lang)}
							</NavLink>
							<NavLink anchor="kepviselok" currentPath={currentPath} onClick={close}>
								{t("nav.mps", lang)}
							</NavLink>
							<NavLink anchor="cselekedj" currentPath={currentPath} onClick={close}>
								{t("action.nav_title", lang)}
							</NavLink>
						</div>

						{/* Language Switch */}
						<div class="px-4 py-3 border-t border-slate-100">
							<LanguageSwitch currentLang={lang} currentPath={currentPath} />
						</div>
					</nav>
				</div>
			)}
		</>
	);
}
