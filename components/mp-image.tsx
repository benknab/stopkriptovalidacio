import type { JSX } from "preact";
import { twMerge } from "tailwind-merge";
import type { MpSlug } from "../data/mps.ts";

type MpImageSize = "sm" | "md" | "lg";

interface MpImageProps {
	slug: MpSlug;
	name: string;
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

export function MpImage({ slug, name, size = "md", class: className }: MpImageProps): JSX.Element {
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
				"rounded-full object-cover border-2 border-slate-200 bg-slate-100 opacity-0 transition-opacity duration-200",
				className,
			)}
			onLoad={(e) => e.currentTarget.classList.replace("opacity-0", "opacity-100")}
		/>
	);
}
