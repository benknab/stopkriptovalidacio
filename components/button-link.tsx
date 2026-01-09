import type { ComponentChildren, JSX } from "preact";

type ButtonVariant = "primary" | "secondary";

interface ButtonLinkProps {
	href: string;
	variant?: ButtonVariant;
	children: ComponentChildren;
	class?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
	primary: "bg-white text-brand hover:bg-white/90",
	secondary: "border-2 border-white text-white hover:bg-white/10",
};

export function ButtonLink({
	href,
	variant = "primary",
	children,
	class: className,
}: ButtonLinkProps): JSX.Element {
	const baseClasses = "inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-colors";

	return (
		<a
			href={href}
			class={`${baseClasses} ${variantClasses[variant]}${className ? ` ${className}` : ""}`}
		>
			{children}
		</a>
	);
}
