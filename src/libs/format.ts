export function formatPrice(n?: number | string) {
  if (n === undefined || n === null || n === "") return "₩0";
  const num = typeof n === "string" ? Number(n) : n;
  return isNaN(num) ? String(n) : `₩${num.toLocaleString()}`;
}


export const fmtMoney = (n?: number | null) =>
  typeof n === "number" ? new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n) : "—";

export const fmtDate = (d?: string | Date | null) => {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(+date)) return "—";
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "2-digit" }).format(date);
};
