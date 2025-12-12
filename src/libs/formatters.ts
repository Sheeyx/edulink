/** Format price → always string */
export function formatPrice(n?: number | string) {
  if (n === undefined || n === null || n === "") return "₩0";
  const num = typeof n === "string" ? Number(n) : n;
  return Number.isNaN(num) ? String(n) : `₩${num.toLocaleString()}`;
}
