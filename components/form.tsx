import type { ComponentChildren, JSX } from "preact";

// Label
interface LabelProps {
	for: string;
	children: ComponentChildren;
	disabled?: boolean;
	uppercase?: boolean;
}

export function Label({ for: htmlFor, children, disabled, uppercase }: LabelProps): JSX.Element {
	const baseClasses = "block text-sm font-semibold mb-2";
	const colorClasses = disabled ? "text-slate-300" : "text-slate-700";
	const uppercaseClasses = uppercase ? "text-xs uppercase tracking-wider mb-1.5" : "";

	return (
		<label for={htmlFor} class={`${baseClasses} ${colorClasses} ${uppercaseClasses}`.trim()}>
			{children}
		</label>
	);
}

// Input
interface InputProps {
	id: string;
	type?: string;
	value: string;
	onInput: (e: Event) => void;
	placeholder?: string;
}

export function Input({ id, type = "text", value, onInput, placeholder }: InputProps): JSX.Element {
	return (
		<input
			id={id}
			type={type}
			value={value}
			onInput={onInput}
			placeholder={placeholder}
			class="w-full px-4 py-3 rounded-lg bg-white text-slate-900 border-2 border-slate-200 focus:border-brand focus:outline-none transition-colors"
		/>
	);
}

// Select
interface SelectProps {
	id: string;
	value: string;
	onChange: (e: Event) => void;
	disabled?: boolean;
	children: ComponentChildren;
}

export function Select({ id, value, onChange, disabled, children }: SelectProps): JSX.Element {
	const enabledClasses =
		"bg-white border-slate-200 text-slate-900 cursor-pointer hover:border-slate-300 focus:border-brand";
	const disabledClasses = "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed";

	return (
		<select
			id={id}
			value={value}
			onChange={onChange}
			disabled={disabled}
			class={`w-full h-11 pl-3 pr-8 border-2 rounded-md text-sm font-medium appearance-none transition-all duration-150 focus:outline-none ${
				disabled ? disabledClasses : enabledClasses
			}`}
		>
			{children}
		</select>
	);
}

// Textarea
interface TextareaProps {
	id: string;
	value: string;
	onInput?: (e: Event) => void;
	rows?: number;
	disabled?: boolean;
	resizable?: boolean;
}

export function Textarea({ id, value, onInput, rows = 6, disabled, resizable = true }: TextareaProps): JSX.Element {
	const baseClasses = "w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors";
	const enabledClasses = "bg-white text-slate-900 border-slate-200 focus:border-brand";
	const disabledClasses = "bg-slate-50 text-slate-600 border-slate-200";
	const resizeClass = resizable ? "resize-y" : "resize-none";

	return (
		<textarea
			id={id}
			value={value}
			onInput={onInput}
			rows={rows}
			disabled={disabled}
			class={`${baseClasses} ${disabled ? disabledClasses : enabledClasses} ${resizeClass}`}
		/>
	);
}

// Search Input with icon
interface SearchInputProps {
	id: string;
	value: string;
	onInput: (e: Event) => void;
	placeholder?: string;
}

export function SearchInput({ id, value, onInput, placeholder }: SearchInputProps): JSX.Element {
	return (
		<div class="relative">
			<input
				id={id}
				type="text"
				value={value}
				onInput={onInput}
				placeholder={placeholder}
				class="w-full h-11 pl-10 pr-4 bg-white border-2 border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 font-medium transition-all duration-150 hover:border-slate-300 focus:outline-none focus:border-brand"
			/>
			<div class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
				<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
		</div>
	);
}

// Select wrapper with chevron icon
interface SelectWrapperProps {
	children: ComponentChildren;
	disabled?: boolean;
}

export function SelectWrapper({ children, disabled }: SelectWrapperProps): JSX.Element {
	return (
		<div class="relative">
			{children}
			<div class={`pointer-events-none absolute right-3 bottom-3.5 ${disabled ? "opacity-30" : ""}`}>
				<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</div>
	);
}
