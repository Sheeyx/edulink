type Props = {
  show: boolean;
  loading: boolean;
  onClick: () => void;
};

export default function LoadMoreButton({ show, loading, onClick }: Props) {
  if (!show) return null;

  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={onClick}
        disabled={loading}
        className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm disabled:opacity-60"
      >
        {loading ? "Loading…" : "Load More Courses"}
      </button>
    </div>
  );
}
