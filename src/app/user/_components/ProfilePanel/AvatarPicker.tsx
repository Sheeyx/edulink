"use client";

import * as React from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

export default function AvatarPicker({
  src,
  fallbackSrc,
  onPick,
}: {
  src: string;
  fallbackSrc: string;
  onPick: (file: File) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-4">
      <div className="relative h-56 w-56 rounded-[28px] overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
        <Image
          src={src || fallbackSrc}
          alt="Avatar preview"
          fill
          sizes="224px"
          className="object-cover"
          priority
          onError={() => {
            // Next/Image doesn't allow direct src replacement; parent should set fallback.
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-5 py-3 font-bold text-gray-950 hover:bg-gray-50 transition"
      >
        <Camera className="w-5 h-5" />
        Change photo
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
          e.currentTarget.value = "";
        }}
      />

      <p className="text-sm text-gray-700">
        PNG/JPG/WEBP. Recommended: square image (min 400×400).
      </p>
    </div>
  );
}
