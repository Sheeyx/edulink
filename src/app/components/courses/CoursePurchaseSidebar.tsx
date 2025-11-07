export default function CoursePurchaseSidebar({
  price,
  oldPrice,
  saleBadge,
  features,
  coupon,
}: {
  price: string;
  oldPrice?: string;
  saleBadge?: string;
  features: string[];
  coupon?: { code: string; note?: string };
}) {
  return (
    <div className="sticky top-6 rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="text-3xl font-bold text-gray-900">{price}</div>
        {oldPrice ? <div className="text-sm line-through text-gray-400">{oldPrice}</div> : null}
        {saleBadge ? (
          <span className="ml-auto text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded">{saleBadge}</span>
        ) : null}
      </div>

      <button className="mt-4 w-full bg-violet-600 text-white font-semibold py-2.5 rounded-lg hover:bg-violet-700">
        Buy Now
      </button>
      <button className="mt-3 w-full bg-white text-violet-700 border border-violet-200 font-semibold py-2.5 rounded-lg hover:bg-violet-50">
        Add to Cart
      </button>

      <ul className="mt-5 space-y-2 text-sm text-gray-700">
        {features.map((f, i) => (
          <li key={i} className="before:content-['✓'] before:text-emerald-600 before:mr-2">{f}</li>
        ))}
      </ul>

      {coupon ? (
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-center">
          <div className="text-xs opacity-90">Apply coupon code</div>
          <div className="font-bold tracking-wide">{coupon.code}</div>
          {coupon.note ? <div className="text-xs opacity-90">{coupon.note}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
