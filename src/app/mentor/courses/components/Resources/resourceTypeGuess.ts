import type { ResourceType } from "@/libs/enums/course.enums";

const EXT_MAP: Record<string, ResourceType> = {
  pdf: "PDF",
  png: "IMAGE",
  jpg: "IMAGE",
  jpeg: "IMAGE",
  gif: "IMAGE",
  webp: "IMAGE",
  mp4: "VIDEO",
  mov: "VIDEO",
  webm: "VIDEO",
  mp3: "AUDIO",
  wav: "AUDIO",
  m4a: "AUDIO",
  doc: "DOCUMENT",
  docx: "DOCUMENT",
  zip: "ARCHIVE",
  rar: "ARCHIVE",
  "7z": "ARCHIVE",
  txt: "TEXT",
  ppt: "PRESENTATION",
  pptx: "PRESENTATION",
  xls: "SPREADSHEET",
  xlsx: "SPREADSHEET",
  csv: "SPREADSHEET",
};

export function guessResourceType(file: File): ResourceType {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_MAP[ext] ?? "DOCUMENT";
}
