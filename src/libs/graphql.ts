// src/libs/graphql.ts
type GQLErrorItem = {
  message?: string;
  extensions?: {
    originalError?: { message?: string };
    exception?: { message?: string };
    message?: string;
  };
};
type GraphQLResponse<T> = { data?: T; errors?: GQLErrorItem[] };

function normalizeBackend(url?: string): string {
  const base = (url || "").trim().replace(/\/+$/, "");
  if (!base) throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
  return `${base}/graphql`;
}

function pickGraphQLError(errors?: GQLErrorItem[]): string {
  if (!errors?.length) return "GraphQL Error";
  const first = errors[0];
  const extMsg =
    first.extensions?.originalError?.message ||
    first.extensions?.exception?.message ||
    first.extensions?.message;
  return String(first.message || extMsg || "GraphQL Error");
}

async function doFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  opts?: {
    token?: string | null;
    withCredentials?: boolean;
    signal?: AbortSignal;
  }
): Promise<T> {
  const url = normalizeBackend(process.env.NEXT_PUBLIC_BACKEND_URL);

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts?.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    // Always send/receive the httpOnly auth cookies the backend sets on
    // login/signup/refresh — this is our own API, never a third party, so
    // there's no reason to ever drop credentials.
    credentials: "include",
    cache: "no-store",
    signal: opts?.signal,
  });

  // HTTP-level error handling (non-2xx)
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `HTTP ${res.status} ${res.statusText}${
        text ? ` — ${text.slice(0, 400)}` : ""
      }`
    );
  }

  // GraphQL-level handling
  let json: GraphQLResponse<T>;
  try {
    json = (await res.json()) as GraphQLResponse<T>;
  } catch {
    throw new Error("Invalid JSON response from GraphQL server");
  }

  if (json.errors?.length) {
    throw new Error(pickGraphQLError(json.errors));
  }
  if (!("data" in json)) {
    throw new Error("No data returned from GraphQL");
  }
  return json.data as T;
}

/** Public: unauthenticated GraphQL call */
export async function gqlFetch<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { withCredentials?: boolean; signal?: AbortSignal }
): Promise<T> {
  return doFetch<T>(query, variables, {
    withCredentials: options?.withCredentials,
    signal: options?.signal,
  });
}

/**
 * Public: authenticated GraphQL call.
 * Auth normally travels via the httpOnly cookie the backend sets on
 * login/signup (always sent — see `doFetch`). `token` is only needed for
 * the rare caller that already has a bearer token handy; it's never read
 * from storage here.
 */
export async function gqlFetchAuth<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string | null,
  options?: { withCredentials?: boolean; signal?: AbortSignal }
): Promise<T> {
  return doFetch<T>(query, variables, {
    token: token ?? null,
    withCredentials: options?.withCredentials ?? true,
    signal: options?.signal,
  });
}
