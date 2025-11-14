export function toISODateOrNull(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  // Midnight local time → ISO. If backend expects date-only, send dateStr instead.
  return new Date(`${dateStr}T00:00:00`).toISOString();
}

export function toNumberOr(value: string, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
