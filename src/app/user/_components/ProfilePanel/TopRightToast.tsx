"use client";

import * as React from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { ToastKind } from "./types";

export default function TopRightToast({
  open,
  kind,
  title,
  message,
  onClose,
  durationMs = 3000,
}: {
  open: boolean;
  kind: ToastKind;
  title: string;
  message?: string | null;
  onClose: () => void;
  durationMs?: number;
}) {
  const isSuccess = kind === "success";
  const [closing, setClosing] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setClosing(false);
  }, [open]);

  if (!open) return null;

  const closeWithAnim = () => {
    setClosing(true);
    window.setTimeout(() => {
      onClose();
      setClosing(false);
    }, 220);
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
        <div
          className={[
            "pointer-events-auto",
            "w-[420px] max-w-[calc(100vw-2rem)]",
            "rounded-2xl border bg-white/95 backdrop-blur-xl shadow-2xl",
            "px-4 py-3",
            isSuccess ? "border-emerald-200" : "border-rose-200",
            closing
              ? "animate-[toastTRout_.22s_cubic-bezier(.2,.8,.2,1)_forwards]"
              : "animate-[toastTRin_.26s_cubic-bezier(.2,.8,.2,1)_forwards]",
          ].join(" ")}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div
              className={[
                "mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl",
                isSuccess
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700",
              ].join(" ")}
            >
              {isSuccess ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-gray-950">
                    {title}
                  </div>
                  {message ? (
                    <div className="mt-0.5 text-sm text-gray-800 leading-snug">
                      {message}
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={closeWithAnim}
                  className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
                  aria-label="Close toast"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={[
                    "h-full w-full origin-left",
                    isSuccess ? "bg-emerald-500" : "bg-rose-500",
                    closing ? "" : "toast-bar",
                  ].join(" ")}
                  style={{ animationDuration: `${durationMs}ms` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes toastTRin {
          0% {
            transform: translate3d(24px, -16px, 0);
            opacity: 0;
          }
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
          }
        }
        @keyframes toastTRout {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
          }
          100% {
            transform: translate3d(24px, -16px, 0);
            opacity: 0;
          }
        }
        .toast-bar {
          animation-name: toastBar;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
        @keyframes toastBar {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </>
  );
}
