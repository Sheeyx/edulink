export function pickGraphQLError(e: any): string {
  return (
    e?.response?.errors?.[0]?.message ||
    e?.errors?.[0]?.message ||
    e?.message ||
    "Something went wrong"
  );
}
