import type { JSX } from "preact";
import { twMerge } from "tailwind-merge";
import type { MpSlug } from "../data/mps.ts";

type MpImageSize = "sm" | "md" | "lg";

interface MpImageProps {
	slug: MpSlug;
	name: string;
	hasImage?: boolean;
	size?: MpImageSize;
	class?: string;
}

const sizeClasses: Record<MpImageSize, string> = {
	sm: "w-16 h-16",
	md: "w-24 h-24",
	lg: "w-24 h-24 sm:w-32 sm:h-32",
};

const sizeDimensions: Record<MpImageSize, number> = {
	sm: 64,
	md: 96,
	lg: 128,
};

function PersonPlaceholder(
	{ size, name, className }: { size: MpImageSize; name: string; className?: string },
): JSX.Element {
	const dimension = sizeDimensions[size];

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={dimension}
			height={dimension}
			viewBox="0 0 96 96"
			role="img"
			aria-label={name}
			class={twMerge(
				sizeClasses[size],
				"rounded-full border-2 border-slate-200 bg-slate-100",
				className,
			)}
		>
			<circle cx="48" cy="36" r="16" fill="#94a3b8" />
			<ellipse cx="48" cy="82" rx="28" ry="22" fill="#94a3b8" />
		</svg>
	);
}

export function MpImage(
	{ slug, name, hasImage = true, size = "md", class: className }: MpImageProps,
): JSX.Element {
	if (!hasImage) {
		return <PersonPlaceholder size={size} name={name} className={className} />;
	}

	const src = `/kepek/${slug}.jpg`;
	const dimension = sizeDimensions[size];

	return (
		<img
			src={src}
			alt={name}
			width={dimension}
			height={dimension}
			loading="lazy"
			class={twMerge(
				sizeClasses[size],
				"rounded-full object-cover border-2 border-slate-200 bg-slate-100",
				className,
			)}
		/>
	);
}
