"use client";

import * as React from "react";
import {
  FiFile,
  FiImage,
  FiVideo,
  FiMusic,
  FiFileText,
  FiArchive,
  FiMonitor,
  FiGrid,
  FiDownload,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import type { ResourceType } from "@/libs/enums/course.enums";
import type { ResourceUI } from "@/libs/types/course/types";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";

const TYPE_ICON: Record<ResourceType, React.ReactNode> = {
  PDF: <FiFileText className="h-4 w-4" />,
  IMAGE: <FiImage className="h-4 w-4" />,
  VIDEO: <FiVideo className="h-4 w-4" />,
  AUDIO: <FiMusic className="h-4 w-4" />,
  DOCUMENT: <FiFile className="h-4 w-4" />,
  ARCHIVE: <FiArchive className="h-4 w-4" />,
  TEXT: <FiFileText className="h-4 w-4" />,
  PRESENTATION: <FiMonitor className="h-4 w-4" />,
  SPREADSHEET: <FiGrid className="h-4 w-4" />,
};

function formatSize(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type Props = {
  resources: ResourceUI[];
  onEdit: (resource: ResourceUI) => void;
  onDelete: (resource: ResourceUI) => void;
};

export default function ResourcesBlock({ resources, onEdit, onDelete }: Props) {
  return (
    <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight lg:text-lg">
          Resources
        </h3>
        <span className="text-xs text-slate-500">
          {resources.length} file{resources.length === 1 ? "" : "s"}
        </span>
      </div>

      {resources.length === 0 ? (
        <div className="rounded-xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
          No resources yet. Use{" "}
          <span className="font-medium text-brand-selected">Add Resource</span> to
          attach files students can download.
        </div>
      ) : (
        <ul className="space-y-2">
          {resources.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2.5 text-sm ring-1 ring-slate-100"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-selected">
                  {TYPE_ICON[r.type] ?? <FiFile className="h-4 w-4" />}
                </span>

                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">{r.title}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span>{r.type}</span>
                    {formatSize(r.size) && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span>{formatSize(r.size)}</span>
                      </>
                    )}
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1">
                      {r.isPublic ? (
                        <FiEye className="h-3 w-3" />
                      ) : (
                        <FiEyeOff className="h-3 w-3" />
                      )}
                      {r.isPublic ? "Public" : "Enrolled only"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={buildDownloadUrl(r.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Download"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100"
                >
                  <FiDownload className="h-3.5 w-3.5" />
                </a>
                <button
                  title="Edit resource"
                  onClick={() => onEdit(r)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/15"
                >
                  <FiEdit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  title="Delete resource"
                  onClick={() => onDelete(r)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
