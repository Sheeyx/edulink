// src/components/ui/Modal.tsx
"use client";

import clsx from "clsx";
import * as React from "react";
import { FiX } from "react-icons/fi";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string;
  className?: string;
};

export function Modal({ open, onClose, children, labelledBy, className }: ModalProps) {
  // Close on Escape
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onClick={handleBackdropClick}
    >
      <div
        className={clsx(
          "relative w-full max-w-lg rounded-[28px] bg-white shadow-2xl border border-gray-100",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

type ModalHeaderProps = {
  title: string;
  onClose: () => void;
  id?: string;
};

export function ModalHeader({ title, onClose, id }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
      <h2 id={id} className="text-lg font-black text-gray-900">
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex items-center justify-center rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        aria-label="Close"
      >
        <FiX size={20} />
      </button>
    </div>
  );
}

export function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-5 space-y-4">{children}</div>;
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
      {children}
    </div>
  );
}
