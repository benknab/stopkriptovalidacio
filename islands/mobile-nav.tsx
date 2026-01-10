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
	href: string;
	children: string;
	onClick: () => void;
}

function NavLink({ href, children, onClick }: NavLinkProps): JSX.Element {
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

	// Handle escape key and body scroll lock
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent): void {
			if (e.key === "Escape" && isOpen.value) {
				close();
			}
		}

		if (isOpen.value) {
			globalThis.document.body.style.overflow = "hidden";
			globalThis.document.addEventListener("keydown", handleKeyDown);
		} else {
			globalThis.document.body.style.overflow = "";
		}

		return () => {
			globalThis.document.body.style.overflow = "";
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

					{/* Menu panel - slides down from top */}
					<nav
						class="absolute top-0 left-0 right-0 bg-white shadow-xl"
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
							<NavLink href="/#attekintes" onClick={close}>
								{t("nav.overview", lang)}
							</NavLink>
							<NavLink href="/#tozsdek" onClick={close}>
								{t("nav.exchanges", lang)}
							</NavLink>
							<NavLink href="/#idovonal" onClick={close}>
								{t("nav.timeline", lang)}
							</NavLink>
							<NavLink href="/#kepviselok" onClick={close}>
								{t("nav.mps", lang)}
							</NavLink>
							<NavLink href="/#cselekedj" onClick={close}>
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
