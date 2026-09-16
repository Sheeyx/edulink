"use client";

import * as React from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { gqlFetchAuth } from "@/libs/graphql";
import { uploadFilesToB2 } from "@/services/b2Upload";
import { getAccessToken, useAuth } from "@/providers/auth-context";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";

import { FALLBACK_AVATAR } from "./constants";
import type { ToastKind, UpdateMemberResp } from "./types";
import { pickGraphQLError } from "./utils";
import { UPDATE_MEMBER } from "@/graphql/mutation/member/mutations";
import TopRightToast from "./TopRightToast";
import AvatarPicker from "./AvatarPicker";
import Field from "./Field";


export default function ProfilePanel() {
  const { user, setUser } = useAuth();

  // toast state
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastKind, setToastKind] = React.useState<ToastKind>("success");
  const [toastTitle, setToastTitle] = React.useState("Saved");
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);
  const toastTimerRef = React.useRef<number | null>(null);

  const showToast = React.useCallback((kind: ToastKind, title: string, msg?: string | null) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToastKind(kind);
    setToastTitle(title);
    setToastMsg(msg ?? null);
    setToastOpen(true);
    toastTimerRef.current = window.setTimeout(() => setToastOpen(false), 3000);
  }, []);

  React.useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  if (!user) {
    return (
      <p className="text-[18px] md:text-[22px] leading-snug text-gray-900">
        Please login to edit your profile.
      </p>
    );
  }

  const initialAvatarUrl = buildDownloadUrl(
    (user as any).memberImage ?? (user as any).image ?? ""
  );

  const [fullName, setFullName] = React.useState<string>(
    (user as any).memberFullName ?? (user as any).name ?? ""
  );
  const [phone, setPhone] = React.useState<string>((user as any).memberPhone ?? "");
  const [bio, setBio] = React.useState<string>((user as any).memberBio ?? "");

  const [password, setPassword] = React.useState<string>("");
  const [showPw, setShowPw] = React.useState(false);

  const [avatarPreview, setAvatarPreview] = React.useState<string>(
    initialAvatarUrl || FALLBACK_AVATAR
  );
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);

  const [saving, setSaving] = React.useState(false);
  const disabled = saving || !fullName.trim();

  // cleanup blob url
  React.useEffect(() => {
    if (!avatarFile) return;
    const url = avatarPreview;
    return () => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    };
  }, [avatarFile, avatarPreview]);

  const onPickAvatar = (file: File) => {
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  async function onSave() {
    if (disabled) return;

    setSaving(true);

    try {
      let imageKey: string | null =
        ((user as any).memberImage as string | null) ??
        ((user as any).image as string | null) ??
        null;

      if (avatarFile) {
        const token = getAccessToken();
        if (!token) throw new Error("Not authenticated (missing access token).");
        const uploaded = await uploadFilesToB2([avatarFile], "members-images", token);
        if (!uploaded?.length) throw new Error("Avatar upload failed.");
        imageKey = uploaded[0];
      }

      const input: Record<string, any> = {
        _id: (user as any)._id ?? (user as any).id,
        memberFullName: fullName.trim(),
        memberPhone: phone.trim(),
        memberBio: bio.trim(),
        memberImage: imageKey,
      };

      if (password.trim()) input.memberPassword = password.trim();

      const data = await gqlFetchAuth<UpdateMemberResp>(
        UPDATE_MEMBER,
        { input },
        undefined,
        { withCredentials: true }
      );

      const updated = data.updateMember;

      // Keep your current AuthUser shape (basic)
      setUser({
        id: (user as any).id ?? updated._id,
        email: updated.memberEmail ?? (user as any).email ?? "",
        name: updated.memberFullName ?? (user as any).name ?? null,
        role: ((updated.memberRole as any) ?? (user as any).role) ?? null,
        image: updated.memberImage ?? (user as any).image ?? null,
      });

      // update avatar preview to server key
      const nextAvatarUrl = buildDownloadUrl(updated.memberImage ?? imageKey ?? "");
      setAvatarPreview(nextAvatarUrl || FALLBACK_AVATAR);

      setAvatarFile(null);
      setPassword("");

      showToast("success", "Profile updated", "Your changes were saved successfully.");
    } catch (e: any) {
      showToast("error", "Update failed", pickGraphQLError(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <TopRightToast
        open={toastOpen}
        kind={toastKind}
        title={toastTitle}
        message={toastMsg}
        onClose={() => setToastOpen(false)}
      />

      <p className="text-[14px] md:text-[16px] leading-relaxed text-gray-800 max-w-3xl">
        Update your personal info and profile photo. Your changes will appear across your
        account and certificates.
      </p>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        <AvatarPicker
          src={avatarPreview || FALLBACK_AVATAR}
          fallbackSrc={FALLBACK_AVATAR}
          onPick={onPickAvatar}
        />

        <div className="space-y-6">
          <Field label="Full name">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-950 font-semibold outline-none focus:ring-4 focus:ring-brand-primary/15"
              placeholder="Your full name"
            />
          </Field>

          <Field label="Phone">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-950 font-semibold outline-none focus:ring-4 focus:ring-brand-primary/15"
              placeholder="+82 10-1234-5678"
            />
          </Field>

          <Field label="Bio">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-950 font-semibold outline-none focus:ring-4 focus:ring-brand-primary/15"
              placeholder="Tell students about you..."
            />
          </Field>

          <Field label="New password (optional)">
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPw ? "text" : "password"}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 pr-12 text-gray-950 font-semibold outline-none focus:ring-4 focus:ring-brand-primary/15"
                placeholder="Leave empty to keep current password"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 hover:bg-gray-50"
                aria-label="Toggle password visibility"
              >
                {showPw ? (
                  <EyeOff className="w-5 h-5 text-gray-700" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </Field>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onSave}
              disabled={disabled}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-selected px-7 py-4 text-white font-extrabold text-lg hover:brightness-90 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {saving && <Loader2 className="w-5 h-5 animate-spin" />}
              {saving ? "Saving..." : "Save changes"}
            </button>

            <span className="text-gray-700 font-semibold">
              {disabled ? "Name is required" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
