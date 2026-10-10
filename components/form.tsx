import type { SyntheticEvent } from "react";
import type { ReactNode, JSX } from "react";

// Label
interface LabelProps {
	htmlFor: string;
	children: ReactNode;
	disabled?: boolean;
	uppercase?: boolean;
}

export function Label({ htmlFor, children, disabled, uppercase }: LabelProps): JSX.Element {
	const baseClasses = "block text-sm font-semibold mb-2";
	const colorClasses = disabled ? "text-slate-300" : "text-slate-700";
	const uppercaseClasses = uppercase ? "text-xs uppercase tracking-wider mb-1.5" : "";

	return (
		<label htmlFor={htmlFor} className={`${baseClasses} ${colorClasses} ${uppercaseClasses}`.trim()}>
			{children}
		</label>
	);
}

// Input
interface InputProps {
	id: string;
	type?: string;
	value: string;
	onChange: (e: SyntheticEvent) => void;
	placeholder?: string;
}

export function Input({ id, type = "text", value, onChange, placeholder }: InputProps): JSX.Element {
	return (
		<input
			id={id}
			type={type}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			className="w-full px-4 py-3 rounded-lg bg-white text-slate-900 border-2 border-slate-200 focus:border-brand focus:outline-none transition-colors"
		/>
	);
}

// Select
interface SelectProps {
	id: string;
	value: string;
	onChange: (e: SyntheticEvent) => void;
	disabled?: boolean;
	children: ReactNode;
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
			className={`w-full h-11 pl-3 pr-8 border-2 rounded-md text-sm font-medium appearance-none transition-all duration-150 focus:outline-none ${
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
	onChange?: (e: SyntheticEvent) => void;
	rows?: number;
	disabled?: boolean;
	resizable?: boolean;
}

export function Textarea({ id, value, onChange, rows = 6, disabled, resizable = true }: TextareaProps): JSX.Element {
	const baseClasses = "w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors";
	const enabledClasses = "bg-white text-slate-900 border-slate-200 focus:border-brand";
	const disabledClasses = "bg-slate-50 text-slate-600 border-slate-200";
	const resizeClass = resizable ? "resize-y" : "resize-none";

	return (
		<textarea
			id={id}
			value={value}
			onChange={onChange}
			rows={rows}
			disabled={disabled}
			className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses} ${resizeClass}`}
		/>
	);
}

// Search Input with icon
interface SearchInputProps {
	id: string;
	value: string;
	onChange: (e: SyntheticEvent) => void;
	placeholder?: string;
}

export function SearchInput({ id, value, onChange, placeholder }: SearchInputProps): JSX.Element {
	return (
		<div className="relative">
			<input
				id={id}
				type="text"
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				className="w-full h-11 pl-10 pr-4 bg-white border-2 border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 font-medium transition-all duration-150 hover:border-slate-300 focus:outline-none focus:border-brand"
			/>
			<div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
				<svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
		</div>
	);
}

// Select wrapper with chevron icon
interface SelectWrapperProps {
	children: ReactNode;
	disabled?: boolean;
}

export function SelectWrapper({ children, disabled }: SelectWrapperProps): JSX.Element {
	return (
		<div className="relative">
			{children}
			<div className={`pointer-events-none absolute right-3 bottom-3.5 ${disabled ? "opacity-30" : ""}`}>
				<svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</div>
	);
}
