export function pickGraphQLError(e: unknown): string {
  if (e && typeof e === "object") {
    const err = e as {
      response?: { errors?: Array<{ message?: string }> };
      errors?: Array<{ message?: string }>;
      message?: string;
    };
    return (
      err.response?.errors?.[0]?.message ||
      err.errors?.[0]?.message ||
      err.message ||
      "Something went wrong"
    );
  }
  return "Something went wrong";
}
