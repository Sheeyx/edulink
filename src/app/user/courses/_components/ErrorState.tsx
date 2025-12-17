"use client";

type Props = {
  message: string;
  onRetry: () => void;
};

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
      <div className="font-extrabold text-red-900">Failed to load courses</div>
      <div className="mt-1 text-sm text-red-800">{message}</div>
      <button
        onClick={onRetry}
        className="mt-4 rounded-2xl bg-red-700 text-white px-4 py-2 text-sm font-bold hover:bg-red-800 transition"
      >
        Try again
      </button>
    </div>
  );
}
