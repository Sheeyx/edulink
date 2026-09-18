// src/app/mentor/edit-profile/EditProfileClient.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, getAccessToken } from "@/providers/auth-context";
import { gqlFetchAuth } from "@/libs/graphql";
import { useUpdateMember } from "@/hooks/mutations/useUpdateMember";
import type { MemberUpdateInput } from "@/libs/types/member/types";
import { uploadFilesToB2 } from "@/services/b2Upload";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";

type MemberBasic = {
  _id: string;
  memberFullName?: string | null;
  memberPhone?: string | null;
  memberBio?: string | null;
  memberImage?: string | null;
  memberEmail?: string | null;
};

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

// helper to clean DB key: "members/xxx.png," -> "members/xxx.png"
function sanitizeKey(raw?: string | null): string {
  if (!raw) return "";
  return raw.trim().replace(/,+$/, "").replace(/^\/+/, "");
}

export default function EditProfileClient() {
  const router = useRouter();
  const qc = useQueryClient();
  const { user, setUser, ready } = useAuth();

  const memberId = user?.id ?? "";

  const accessToken = getAccessToken() ?? undefined;

  const { data: member, isLoading: isMemberLoading } = useQuery({
    queryKey: ["member", memberId],
    enabled: !!memberId && !!accessToken,
    queryFn: async () => {
      const res = await gqlFetchAuth<{ getMember: MemberBasic }>(
        GET_MEMBER,
        { id: memberId },
        accessToken,
        { withCredentials: true }
      );
      return res.getMember;
    },
  });

  const [form, setForm] = React.useState({
    memberFullName: "",
    memberPhone: "",
    memberBio: "",
    memberImage: "",
  });

  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  // Set initial form + preview (old photo)
  React.useEffect(() => {
    if (member) {
      const cleanImage = sanitizeKey(member.memberImage);

      setForm({
        memberFullName: member.memberFullName || "",
        memberPhone: member.memberPhone || "",
        memberBio: member.memberBio || "",
        memberImage: cleanImage,
      });

      if (cleanImage) {
        // use backend download URL: /api/s3/download/...
        setPreviewUrl(buildDownloadUrl(cleanImage));
      }
    }
  }, [member]);

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

      const nextUser = {
        id: user?.id || updated._id || memberId,
        email: user?.email || member?.memberEmail || "",
        name: updated.memberFullName ?? user?.name ?? null,
        role: user?.role ?? null,
        image: updated.memberImage ?? user?.image ?? null, // used in header / sidebar
      };

      setUser(nextUser);
      try {
        localStorage.setItem("currentUser", JSON.stringify(nextUser));
      } catch {}

      await qc.invalidateQueries({ queryKey: ["member", memberId] });
      router.push("/mentor");
    },
  });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!accessToken) {
      router.push("/auth/login");
      return;
    }

    // 1️⃣ Show immediate local preview in the circle
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    setUploading(true);
    setUploadError(null);

    try {
      // 2️⃣ Upload to B2 -> returns key: "members/xxx.png"
      const [rawKey] = await uploadFilesToB2([file], "members", accessToken);
      const key = sanitizeKey(rawKey);

      // store key in form (DB will save this)
      setForm((prev) => ({ ...prev, memberImage: key }));

      // 3️⃣ After success, use final backend URL for preview
      const uploadedUrl = buildDownloadUrl(key);
      setPreviewUrl(uploadedUrl);
    } catch (err: unknown) {
      console.error("handleFileChange error:", err);
      setUploadError(err instanceof Error ? err.message : "Upload failed");

      // revert preview back to old image if exists
      const cleanOld = sanitizeKey(member?.memberImage);
      setPreviewUrl(cleanOld ? buildDownloadUrl(cleanOld) : null);
    } finally {
      // clean up local object URL if it was created
      URL.revokeObjectURL(localPreview);
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) {
      router.push("/auth/login");
      return;
    }

    const input: MemberUpdateInput = {
      _id: memberId,
      memberFullName: form.memberFullName.trim(),
      memberPhone: form.memberPhone.trim(),
      memberBio: form.memberBio.trim(),
      memberImage: form.memberImage.trim(), // saved as "members/xxx.png"
    };

    await updateMember({ input, token: accessToken });
  }

  const disabled = isPending || isMemberLoading || !ready;

  if (!memberId) {
    return (
      <div>
        <p className="text-sm text-gray-600">
          No member ID found. Please{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="text-brand-selected hover:underline font-bold"
          >
            log in
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Edit Profile</h1>
        <p className="text-gray-600 mt-2">
          Update your profile information and photo
        </p>
      </header>

      <form onSubmit={onSubmit} className="max-w-2xl">
        {/* Profile Photo Section */}
        <div className="mb-10 pb-8 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Profile Photo
          </h2>

          <div className="flex items-center gap-8">
            {/* Avatar Preview (circle) */}
            <div className="relative">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-brand-primary/15 to-brand-primary/15 ring-4 ring-white shadow-xl">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Profile preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-12 h-12 text-brand-primary/40" />
                  </div>
                )}
              </div>

              {/* Upload indicator overlay */}
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="photo-upload"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-selected text-white rounded-xl font-bold hover:brightness-90 transition cursor-pointer shadow-lg shadow-brand-selected/30"
                  >
                    <Camera className="w-5 h-5" />
                    {uploading ? "Uploading..." : "Upload Photo"}
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={disabled || uploading}
                    className="hidden"
                  />
                </div>

                <p className="text-sm text-gray-500">
                  JPG, PNG or GIF. Max size 10MB.
                </p>

                {uploadError && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    {uploadError}
                  </p>
                )}

                {form.memberImage && (
                  <p className="text-xs text-gray-400 font-mono break-all">
                    {form.memberImage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Profile Information
          </h2>

          {/* Email (readonly) */}
          {member?.memberEmail && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500"
                value={member.memberEmail}
                readOnly
              />
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15 outline-none transition"
              value={form.memberFullName}
              onChange={(e) =>
                setForm((s) => ({ ...s, memberFullName: e.target.value }))
              }
              placeholder="Enter your full name"
              disabled={disabled}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15 outline-none transition"
              value={form.memberPhone}
              onChange={(e) =>
                setForm((s) => ({ ...s, memberPhone: e.target.value }))
              }
              placeholder="+82 10-0000-0000"
              disabled={disabled}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15 outline-none transition resize-none"
              rows={5}
              value={form.memberBio}
              onChange={(e) =>
                setForm((s) => ({ ...s, memberBio: e.target.value }))
              }
              placeholder="Tell students about yourself, your experience, and teaching style..."
              disabled={disabled}
            />
            <p className="text-xs text-gray-500 mt-2">
              {form.memberBio.length} characters
            </p>
          </div>
        </div>

        {/* Error Messages */}
        {updateError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-800">
              {(updateError as Error).message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-selected text-white px-8 py-3.5 font-extrabold hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-brand-selected/30"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push("/mentor")}
            disabled={disabled}
            className="rounded-xl border-2 border-gray-300 px-8 py-3.5 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Cancel
          </button>
        </div>

        {!accessToken && (
          <p className="text-sm text-amber-600 mt-4 p-3 bg-amber-50 rounded-lg">
            ⚠️ No access token found. Please log in again.
          </p>
        )}
      </form>
    </div>
  );
}
