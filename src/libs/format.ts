export function formatPrice(n?: number | string) {
  if (n === undefined || n === null || n === "") return "₩0";
  const num = typeof n === "string" ? Number(n) : n;
  return isNaN(num) ? String(n) : `₩${num.toLocaleString()}`;
}
