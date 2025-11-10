"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUpdateMember } from "@/hooks/mutations/useUpdateMember";
import { MemberUpdateInput } from "@/libs/types/member/types";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/auth-context";

type Props = {
  memberId: string;
  initial?: Partial<
    Pick<MemberUpdateInput, "memberFullName" | "memberPhone" | "memberBio" | "memberImage">
  >;
  onDone?: () => void;
};

export default function UpdateMemberForm({ memberId, initial, onDone }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // NextAuth (optional fallback)
  const { data: session, status: sessionStatus } = useSession();

  // Custom auth (preferred)
  const { user, setUser } = useAuth();

  // Resolve access token: localStorage (custom) → NextAuth (fallback)
  const accessToken = React.useMemo(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("accessToken");
      if (t) return t;
    }
    const s = session as any;
    return s?.accessToken ?? s?.user?.accessToken ?? undefined;
  }, [session]);

  const [form, setForm] = React.useState({
    memberFullName: initial?.memberFullName ?? "",
    memberPhone: initial?.memberPhone ?? "",
    memberBio: initial?.memberBio ?? "",
    memberImage: initial?.memberImage ?? "",
  });

  const { mutateAsync, isPending, error } = useUpdateMember({
    onSuccess: async (data: any) => {
      // Try to read updated fields from mutation result (adjust path to your API)
      const updated =
        data?.updateMember ??
        data?.member ??
        {
          _id: memberId,
          memberFullName: form.memberFullName,
          memberImage: form.memberImage,
          memberPhone: form.memberPhone,
          memberBio: form.memberBio,
        };

      // 1) Update AuthContext (so Navbar / pages re-render)
      const nextUser = {
        id: user?.id || updated._id || memberId,
        email: user?.email || "",
        name: updated.memberFullName ?? user?.name,
        role: user?.role ?? null,
        image: updated.memberImage ?? user?.image,
      };
      setUser(nextUser);

      // 2) Persist to localStorage so refresh shows new data
      try {
        localStorage.setItem("currentUser", JSON.stringify(nextUser));
      } catch {}

      // 3) Invalidate any cached queries for this member (if you use them)
      queryClient.invalidateQueries({ queryKey: ["member", memberId] });

      onDone?.();
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      router.push("/auth/login");
      return;
    }

    const input: MemberUpdateInput = {
      _id: memberId,
      memberFullName: form.memberFullName?.trim(),
      memberPhone: form.memberPhone?.trim(),
      memberBio: form.memberBio?.trim(),
      memberImage: form.memberImage?.trim(),
    };

    await mutateAsync({ input, token: accessToken });
  };

  const disabled = isPending || sessionStatus === "loading";

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-xl">
      <div>
        <label className="block text-sm font-medium mb-1">Full name</label>
        <input
          className="w-full rounded-xl border p-3"
          value={form.memberFullName}
          onChange={(e) => setForm((s) => ({ ...s, memberFullName: e.target.value }))}
          placeholder="Your full name"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          className="w-full rounded-xl border p-3"
          value={form.memberPhone}
          onChange={(e) => setForm((s) => ({ ...s, memberPhone: e.target.value }))}
          placeholder="+82 10-0000-0000"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          className="w-full rounded-xl border p-3"
          rows={4}
          value={form.memberBio}
          onChange={(e) => setForm((s) => ({ ...s, memberBio: e.target.value }))}
          placeholder="Tell students about yourself…"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Avatar URL</label>
        <input
          className="w-full rounded-xl border p-3"
          value={form.memberImage}
          onChange={(e) => setForm((s) => ({ ...s, memberImage: e.target.value }))}
          placeholder="https://…"
          disabled={disabled}
        />
      </div>

      {error ? <p className="text-sm text-red-600">{(error as Error).message}</p> : null}

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex items-center justify-center rounded-xl bg-purple-600 text-white px-5 py-3 font-semibold hover:bg-purple-700 disabled:opacity-70"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>

      {!accessToken && (
        <p className="text-xs text-amber-600 mt-2">
          No access token found. Please log in again.
        </p>
      )}
    </form>
  );
}
