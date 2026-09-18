"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, X } from "lucide-react";
import { useNotifications, type AppNotification } from "@/hooks/useNotifications";

// Matches the CSS transition duration below — the dismiss mutation fires
// only after the collapse animation finishes, so the list never jumps.
const DISMISS_ANIMATION_MS = 250;

function timeAgo(iso: string): string {
  const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diffSec < 60) return "just now";
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, dismiss } = useNotifications({
    limit: 8,
  });

  const handleDismiss = (id: string) => {
    setRemovingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      dismiss(id);
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, DISMISS_ANIMATION_MS);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        title="Notifications"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-selected transition hover:bg-brand-primary/20 hover:scale-105"
      >
        <Bell className="h-[18px] w-[18px] transition-transform group-hover:-rotate-6" strokeWidth={2.25} />
        {unreadCount > 0 && (
          <span
            key={unreadCount}
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-selected px-1 text-[10px] font-bold text-white ring-2 ring-white"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="text-xs font-medium text-brand-primary hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {isLoading ? (
            <p className="px-4 py-6 text-sm text-gray-500 text-center">Loading…</p>
          ) : notifications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500 text-center">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <NotificationItem
                key={n._id}
                notification={n}
                removing={removingIds.has(n._id)}
                onOpen={() => {
                  if (!n.isRead) markAsRead(n._id);
                  setOpen(false);
                }}
                onDismiss={() => handleDismiss(n._id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification: n,
  removing,
  onOpen,
  onDismiss,
}: {
  notification: AppNotification;
  removing: boolean;
  onOpen: () => void;
  onDismiss: () => void;
}) {
  return (
    <div
      className={`grid transition-all duration-[250ms] ease-in-out ${
        removing ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
      }`}
    >
      <div className="overflow-hidden min-h-0">
        <div
          className={`group relative border-b border-gray-50 last:border-0 hover:bg-gray-50 ${
            n.isRead ? "" : "bg-brand-primary/5"
          }`}
        >
          <button type="button" onClick={onOpen} className="block w-full text-left px-4 py-3 pr-9">
            <div className="flex items-start gap-2">
              {!n.isRead && <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-selected shrink-0" />}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{n.body}</p>
                <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            title="Dismiss"
            aria-label="Dismiss notification"
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 opacity-0 transition hover:bg-gray-200 hover:text-gray-700 group-hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
