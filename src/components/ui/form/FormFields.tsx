// src/components/ui/form/FormFields.tsx
"use client";

import clsx from "clsx";
import * as React from "react";

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
          className="text-xs font-medium uppercase tracking-wide text-slate-500"
        >
          {label}{" "}
          {required && <span className="text-red-500" aria-hidden="true">*</span>}
        </label>
        <input
          id={id}
          ref={ref}
          className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          {...rest}
        />
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
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
          className="text-xs font-medium uppercase tracking-wide text-slate-500"
        >
          {label}{" "}
          {required && <span className="text-red-500" aria-hidden="true">*</span>}
        </label>
        <textarea
          id={id}
          ref={ref}
          className="w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          {...rest}
        />
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
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
        className="text-xs font-medium uppercase tracking-wide text-slate-500"
      >
        {label}{" "}
        {required && <span className="text-red-500" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        type="file"
        className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800 disabled:opacity-70"
        {...rest}
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
};

export const ErrorAlert = ({ message }: { message?: string | null }) => {
  if (!message) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
      {message}
    </div>
  );
};
