// src/hooks/mutations/useUpdateMember.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { updateMember } from "@/graphql/member/updateMember";
import { MemberUpdateInput } from "@/libs/types/member/types";

export function useUpdateMember(opts?: {
  onSuccess?: (data: Awaited<ReturnType<typeof updateMember>>) => void;
  onError?: (err: Error) => void;
}) {
  return useMutation({
    mutationFn: async (payload: { input: MemberUpdateInput; token?: string }) =>
      updateMember(payload.input, payload.token),
    ...opts,
  });
}
