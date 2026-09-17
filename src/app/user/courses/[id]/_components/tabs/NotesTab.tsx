"use client";

import * as React from "react";
import { StickyNote } from "lucide-react";
import { useAuth } from "@/providers/auth-context";

// Notes have no backend yet — kept per-browser via localStorage so the
// feature works today without inventing a server-side notes API.
function storageKey(memberId: string | undefined, lessonId: string) {
  return `lessonNotes:${memberId || "anon"}:${lessonId}`;
}

export default function NotesTab({ lessonId, lessonTitle }: { lessonId: string; lessonTitle: string }) {
  const { user } = useAuth();
  const key = storageKey(user?.id || user?._id, lessonId);

  const [value, setValue] = React.useState("");
  const [saved, setSaved] = React.useState(true);
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    try {
      setValue(localStorage.getItem(key) || "");
    } catch {
      setValue("");
    }
    setSaved(true);
  }, [key]);

  const onChange = (v: string) => {
    setValue(v);
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        if (v.trim()) localStorage.setItem(key, v);
        else localStorage.removeItem(key);
      } catch {
        // ignore — private-browsing / storage unavailable
      }
      setSaved(true);
    }, 500);
  };

  return (
    <div className="p-6 space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <StickyNote className="w-4 h-4" />
        Personal notes for <span className="font-bold text-gray-700">{lessonTitle}</span>
        <span className="ml-auto text-xs">{saved ? "Saved" : "Saving..."}</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Jot down anything worth remembering from this lesson..."
        rows={10}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-primary/25 resize-y"
      />
      <p className="text-xs text-gray-400">
        Notes are saved in this browser only, per lesson — they aren&apos;t synced across devices yet.
      </p>
    </div>
  );
}
