// src/components/ui/form/FormFields.tsx
"use client";

import clsx from "clsx";
import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

type BaseFieldProps = {
  label: string;
  id: string;
  required?: boolean;
  hint?: string;
  className?: string;
};

type TextInputProps = BaseFieldProps &
  React.InputHTMLAttributes<HTMLInputElement>;

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, id, required, hint, className, ...rest }, ref) => {
    return (
      <div className={clsx("space-y-1.5", className)}>
        <label
          htmlFor={id}
          className="text-xs font-medium uppercase tracking-wide text-gray-500"
        >
          {label}{" "}
          {required && <span className="text-red-500" aria-hidden="true">*</span>}
        </label>
        <input
          id={id}
          ref={ref}
          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15 disabled:bg-gray-50"
          {...rest}
        />
        {hint && <p className="text-xs text-gray-400">{hint}</p>}
      </div>
    );
  }
);
TextInput.displayName = "TextInput";

type TextareaProps = BaseFieldProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, required, hint, className, ...rest }, ref) => {
    return (
      <div className={clsx("space-y-1.5", className)}>
        <label
          htmlFor={id}
          className="text-xs font-medium uppercase tracking-wide text-gray-500"
        >
          {label}{" "}
          {required && <span className="text-red-500" aria-hidden="true">*</span>}
        </label>
        <textarea
          id={id}
          ref={ref}
          className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15 disabled:bg-gray-50"
          {...rest}
        />
        {hint && <p className="text-xs text-gray-400">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

type FileInputProps = BaseFieldProps &
  React.InputHTMLAttributes<HTMLInputElement>;

export const FileInput = ({
  label,
  id,
  required,
  hint,
  className,
  ...rest
}: FileInputProps) => {
  return (
    <div className={clsx("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wide text-gray-500"
      >
        {label}{" "}
        {required && <span className="text-red-500" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        type="file"
        className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-selected file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:brightness-90 disabled:opacity-70"
        {...rest}
      />
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
};

export type SelectOption<T extends string> = { value: T; label: string };

type SelectProps<T extends string> = {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  icon?: React.ReactNode;
  label?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  /** Visually highlight the field, e.g. when it holds a non-default value. */
  active?: boolean;
};

export function Select<T extends string>({
  value,
  options,
  onChange,
  icon,
  label,
  id,
  className,
  disabled,
  active,
}: SelectProps<T>) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const selected = options.find((opt) => opt.value === value);

  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className={clsx(label && "space-y-1.5", className)} ref={containerRef}>
      {label && (
        <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className={clsx(
            "group flex w-full items-center gap-2.5 rounded-2xl border py-1.5 pl-1.5 pr-4 text-left text-sm transition-all duration-200",
            "focus:border-brand-primary/80 focus:outline-none focus:ring-4 focus:ring-brand-primary/15",
            active
              ? "border-brand-primary/25 bg-brand-primary/10 shadow-sm shadow-brand-primary/15"
              : "border-gray-200 bg-white shadow-sm hover:border-brand-primary/25 hover:shadow-md",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          {icon && (
            <span
              className={clsx(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors",
                active
                  ? "bg-brand-primary text-white"
                  : "bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary/15"
              )}
            >
              {icon}
            </span>
          )}
          <span className="min-w-0 flex-1 truncate font-semibold text-gray-700">
            {selected?.label ?? ""}
          </span>
          <ChevronDown
            className={clsx(
              "h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute left-0 top-[calc(100%+8px)] z-20 min-w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl shadow-gray-200/60"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li key={opt.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={clsx(
                      "flex w-full items-center justify-between gap-3 whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors",
                      isSelected
                        ? "bg-brand-primary/10 text-brand-selected"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {opt.label}
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-brand-primary" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export const ErrorAlert = ({ message }: { message?: string | null }) => {
  if (!message) return null;

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
      {message}
    </div>
  );
};
