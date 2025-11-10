// lib/backend.ts
export type MemberRole = "STUDENT" | "MENTOR" | "ADMIN";
export type MemberProfile = {
  id: string;
  role: MemberRole;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

const BACKEND_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:3003";

type GQL<T> = { data?: T; errors?: Array<{ message: string }> };

function mapRole(r?: string | null): MemberRole | undefined {
  if (r === "STUDENT" || r === "MENTOR" || r === "ADMIN") return r;
  return undefined;
}

async function gql<T>(query: string, variables?: Record<string, any>) {
  const endpoint = `${BACKEND_URL.replace(/\/$/, "")}/graphql`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    cache: "no-store",
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as GQL<T>;
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(json.errors ?? {})}`);
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data as T;
}

export async function getMemberByGoogleId(googleId: string): Promise<MemberProfile | null> {
  const data = await gql<{
    checkSocialIdExists: {
      exists: boolean;
      memberData: {
        _id: string;
        memberRole?: string | null;
        memberFullName?: string | null;
        memberEmail?: string | null;
        memberImage?: string | null;
      } | null;
    };
  }>(
    `
    query CheckSocialIdExists($input: CheckSocialUserInput!) {
      checkSocialIdExists(input: $input) {
        exists
        memberData {
          _id
          memberRole
          memberFullName
          memberEmail
          memberImage
        }
      }
    }
    `,
    { input: { memberGoogleId: googleId, memberAuth: "GOOGLE" } }
  );

  const m = data?.checkSocialIdExists?.memberData;
  if (!m) return null;

  return {
    id: m._id,
    role: mapRole(m.memberRole) ?? "STUDENT",
    name: m.memberFullName ?? null,
    email: m.memberEmail ?? null,
    avatarUrl: m.memberImage ?? null,
  };
}
