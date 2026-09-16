import Link from "next/link";
import { SearchX } from "lucide-react";

type Props = {
  title?: string;
  message?: string;
  homeHref?: string;
  homeLabel?: string;
};

export default function NotFoundFallback({
  title = "Page not found",
  message = "The page you're looking for doesn't exist or may have been moved.",
  homeHref = "/",
  homeLabel = "Go home",
}: Props) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-[0_8px_24px_rgba(251,133,0,0.08)]">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-brand-primary/15 bg-brand-primary/10">
          <SearchX className="h-7 w-7 text-brand-selected" />
        </div>

        <h2 className="mt-4 text-xl font-black text-gray-900">{title}</h2>
        <p className="mt-1.5 text-sm text-gray-600">{message}</p>

        <div className="mt-6 flex items-center justify-center">
          <Link
            href={homeHref}
            className="rounded-2xl bg-brand-selected px-5 py-2.5 text-sm font-extrabold text-white transition hover:brightness-90"
          >
            {homeLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
