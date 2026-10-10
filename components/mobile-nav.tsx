import { useState } from "react";
import type { JSX } from "react";
import { useEffect } from "react";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { LanguageSwitch } from "./language-switch.tsx";
import { getHomeAnchor } from "../utils/localized-path.ts";

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
	const href = getHomeAnchor(anchor, currentPath);

	return (
		<a
			href={href}
			onClick={onClick}
			className="block py-3 px-4 text-lg font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
		>
			{children}
		</a>
	);
}

export function MobileNav({ lang, currentPath }: MobileNavProps): JSX.Element {
	const [isOpen, setIsOpen] = useState(INITIAL_CLOSED);

	function open(): void {
		setIsOpen(true);
	}

	function close(): void {
		setIsOpen(false);
	}

	// Handle escape key
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent): void {
			if (e.key === "Escape" && isOpen) {
				close();
			}
		}

		if (isOpen) {
			globalThis.document.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			globalThis.document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen]);

	return (
		<>
			{/* Hamburger Button */}
			<button
				type="button"
				onClick={open}
				className="sm:hidden flex items-center justify-center w-11 h-11 -mr-2 text-slate-600 hover:text-slate-900 transition-colors"
				aria-label={t("nav.menu", lang)}
				aria-expanded={isOpen}
			>
				<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>

			{/* Overlay - opens from top */}
			{isOpen && (
				<div className="fixed inset-0 z-50 sm:hidden">
					{/* Backdrop */}
					<div className="absolute inset-0 bg-black/50" onClick={close} aria-hidden="true" />

					{/* Menu panel - full screen */}
					<nav className="absolute inset-0 bg-white flex flex-col" aria-label={t("nav.menu", lang)}>
						{/* Header with close button */}
						<div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
							<span className="text-xl font-bold text-slate-900">Stop Kriptovalidáció</span>
							<button
								type="button"
								onClick={close}
								className="flex items-center justify-center w-11 h-11 -mr-2 text-slate-600 hover:text-slate-900 transition-colors"
								aria-label={t("nav.close", lang)}
							>
								<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						{/* Navigation Links */}
						<div className="py-2">
							<NavLink anchor="attekintes" currentPath={currentPath} onClick={close}>
								{t("nav.overview", lang)}
							</NavLink>
							<NavLink anchor="tozsdek" currentPath={currentPath} onClick={close}>
								{t("nav.exchanges", lang)}
							</NavLink>
							<NavLink anchor="idovonal" currentPath={currentPath} onClick={close}>
								{t("nav.timeline", lang)}
							</NavLink>
						</div>

						{/* Language Switch */}
						<div className="px-4 py-3 border-t border-slate-100">
							<LanguageSwitch currentLang={lang} currentPath={currentPath} />
						</div>
					</nav>
				</div>
			)}
		</>
	);
}
