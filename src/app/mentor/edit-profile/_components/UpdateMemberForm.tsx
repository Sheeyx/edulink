// src/app/mentor/components/UpdateMemberForm.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/auth-context";
import { gqlFetchAuth } from "@/libs/graphql";
import { useUpdateMember } from "@/hooks/mutations/useUpdateMember";
import type { MemberUpdateInput } from "@/libs/types/member/types";

type MemberBasic = {
  _id: string;
  memberFullName?: string | null;
  memberPhone?: string | null;
  memberBio?: string | null;
  memberImage?: string | null;
  memberEmail?: string | null;
};

type Props = {
  memberId: string;
  initial?: Partial<
    Pick<MemberUpdateInput, "memberFullName" | "memberPhone" | "memberBio" | "memberImage">
  >;
  onDone?: () => void;
};

/** Adjust field names to match your backend exactly */
const GET_MEMBER = `
  query GetMember($id: String!) {
    getMember(memberId: $id) {
      _id
      memberFullName
      memberPhone
      memberBio
      memberImage
      memberEmail
    }
  }
`;

export default function UpdateMemberForm({ memberId, initial, onDone }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const { user, setUser, ready } = useAuth();

  const shouldFetch =
    !initial ||
    initial.memberFullName == null ||
    initial.memberPhone == null ||
    initial.memberBio == null ||
    initial.memberImage == null;

  const { data: member, isLoading: isMemberLoading, error: memberError } = useQuery({
    queryKey: ["member", memberId],
    enabled: !!memberId && shouldFetch,
    queryFn: async () => {
      const res = await gqlFetchAuth<{ getMember: MemberBasic }>(GET_MEMBER, { id: memberId });
      return res.getMember;
    },
  });

  const oldData = React.useMemo(() => {
    const fetched: Partial<MemberBasic> = member || {};
    return {
      memberFullName: initial?.memberFullName ?? fetched.memberFullName ?? "",
      memberPhone: initial?.memberPhone ?? fetched.memberPhone ?? "",
      memberBio: initial?.memberBio ?? fetched.memberBio ?? "",
      memberImage: initial?.memberImage ?? fetched.memberImage ?? "",
      memberEmail: fetched.memberEmail ?? "",
    };
  }, [initial, member]);

  const [form, setForm] = React.useState({
    memberFullName: "",
    memberPhone: "",
    memberBio: "",
    memberImage: "",
  });

  React.useEffect(() => {
    setForm({
      memberFullName: oldData.memberFullName,
      memberPhone: oldData.memberPhone,
      memberBio: oldData.memberBio,
      memberImage: oldData.memberImage,
    });
  }, [oldData.memberFullName, oldData.memberPhone, oldData.memberBio, oldData.memberImage]);

  const {
    mutateAsync: updateMember,
    isPending,
    error: updateError,
  } = useUpdateMember({
    onSuccess: async (payload) => {
      const updated =
        payload?.updateMember ?? {
          _id: memberId,
          memberFullName: form.memberFullName,
          memberImage: form.memberImage,
          memberPhone: form.memberPhone,
          memberBio: form.memberBio,
        };

      // update auth snapshot
      const nextUser = {
        id: user?.id || updated._id || memberId,
        email: user?.email || oldData.memberEmail || "",
        name: updated.memberFullName ?? user?.name ?? null,
        role: user?.role ?? null,
        image: updated.memberImage ?? user?.image ?? null,
      };
      setUser(nextUser);

      try {
        localStorage.setItem("currentUser", JSON.stringify(nextUser));
      } catch {}

      await qc.invalidateQueries({ queryKey: ["member", memberId] });
      onDone?.();
    },
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!memberId) {
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
    await updateMember({ input });
  }

  const disabled = isPending || !ready || isMemberLoading;

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-xl">
      {/* Optional read-only email */}
      {oldData.memberEmail ? (
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Email
          </label>
          <input
            className="w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-900"
            value={oldData.memberEmail}
            readOnly
          />
        </div>
      ) : null}

      <div>
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Full name
        </label>
        <input
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15 outline-none"
          value={form.memberFullName}
          onChange={(e) => setForm((s) => ({ ...s, memberFullName: e.target.value }))}
          placeholder="Your full name"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Phone
        </label>
        <input
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15 outline-none"
          value={form.memberPhone}
          onChange={(e) => setForm((s) => ({ ...s, memberPhone: e.target.value }))}
          placeholder="+82 10-0000-0000"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Bio
        </label>
        <textarea
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15 outline-none"
          rows={4}
          value={form.memberBio}
          onChange={(e) => setForm((s) => ({ ...s, memberBio: e.target.value }))}
          placeholder="Tell students about yourself…"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Photo URL
        </label>
        <input
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15 outline-none"
          value={form.memberImage}
          onChange={(e) => setForm((s) => ({ ...s, memberImage: e.target.value }))}
          placeholder="https://…"
          disabled={disabled}
        />
      </div>

      {memberError ? (
        <p className="text-sm text-red-600">
          Failed to load member: {(memberError as Error).message}
        </p>
      ) : null}

      {updateError ? (
        <p className="text-sm text-red-600">{(updateError as Error).message}</p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-2xl bg-brand-selected text-white px-5 py-3 font-extrabold hover:brightness-90 disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => history.back()}
          className="rounded-2xl border border-gray-300 px-5 py-3 font-semibold hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
