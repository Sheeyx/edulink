"use client";

import * as React from "react";
import { MessageCircle, Send, Trash2, CornerDownRight } from "lucide-react";
import { useAuth } from "@/providers/auth-context";
import { useComments, type Comment } from "../../_hooks/useComments";
import { timeAgo } from "../../_utils/format";

function Avatar({ name }: { name?: string | null }) {
  const initials = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-brand-primary/15 text-brand-selected grid place-items-center text-xs font-black shrink-0">
      {initials}
    </div>
  );
}

function ReplyComposer({ onSubmit }: { onSubmit: (text: string) => Promise<void> }) {
  const [value, setValue] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const submit = async () => {
    if (!value.trim() || busy) return;
    setBusy(true);
    try {
      await onSubmit(value);
      setValue("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-2 flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Write a reply..."
        className="flex-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-brand-primary/25"
      />
      <button
        onClick={submit}
        disabled={busy || !value.trim()}
        className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition"
      >
        Reply
      </button>
    </div>
  );
}

export default function QATab({ courseId }: { courseId: string }) {
  const { user } = useAuth();
  const { comments, isLoading, posting, postComment, postReply, removeComment } = useComments(courseId, true);

  const [draft, setDraft] = React.useState("");
  const [replyOpenId, setReplyOpenId] = React.useState<string | null>(null);
  const myId = user?.id || user?._id;

  const submitComment = async () => {
    if (!draft.trim()) return;
    await postComment(draft);
    setDraft("");
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start gap-3">
        <Avatar name={user?.name || user?.memberFullName} />
        <div className="flex-1">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask a question or share something with the class..."
            rows={2}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-primary/25 resize-none"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={submitComment}
              disabled={posting || !draft.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-selected text-white px-4 py-2 text-xs font-extrabold hover:brightness-90 disabled:opacity-50 transition"
            >
              <Send className="w-3.5 h-3.5" />
              Post
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-gray-500">Loading discussion...</div>
      ) : !comments.length ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-400">
          <MessageCircle className="w-8 h-8" />
          <div className="text-sm">No questions yet — be the first to ask.</div>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map((c: Comment) => (
            <div key={c._id} className="flex items-start gap-3">
              <Avatar name={c.memberData?.memberFullName} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-gray-900">
                    {c.memberData?.memberFullName || "Student"}
                  </span>
                  <span className="text-xs text-gray-400">{timeAgo(c.createdAt)}</span>
                  {myId && c.memberId === myId && (
                    <button
                      onClick={() => removeComment(c._id)}
                      className="ml-auto text-gray-400 hover:text-red-500 transition"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-700">{c.comment}</p>

                <button
                  onClick={() => setReplyOpenId(replyOpenId === c._id ? null : c._id)}
                  className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-800 transition"
                >
                  <CornerDownRight className="w-3.5 h-3.5" />
                  Reply {c.commentReplies?.length ? `(${c.commentReplies.length})` : ""}
                </button>

                {c.commentReplies?.length > 0 && (
                  <div className="mt-2 space-y-2 border-l-2 border-gray-100 pl-3">
                    {c.commentReplies.map((r, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Avatar name={r.memberData?.memberFullName} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-gray-900">
                              {r.memberData?.memberFullName || "Student"}
                            </span>
                            <span className="text-xs text-gray-400">{timeAgo(r.createdAt)}</span>
                          </div>
                          <p className="text-xs text-gray-700">{r.repliesComment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {replyOpenId === c._id && (
                  <ReplyComposer onSubmit={(text) => postReply(c._id, text)} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
