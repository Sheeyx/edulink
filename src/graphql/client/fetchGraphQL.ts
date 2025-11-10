export async function fetchGraphQL<T>(
  endpoint: string,
  query: string,
  variables?: Record<string, any>,
  accessToken?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    // fall through
  }

  if (!res.ok || json?.errors) {
    const errMsg =
      json?.errors?.[0]?.message ??
      `HTTP ${res.status} ${res.statusText}` ??
      "GraphQL request failed";
    throw new Error(`GraphQL ERROR: ${errMsg}`);
  }

  return json.data as T;
}
