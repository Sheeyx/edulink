export default function CourseDetailLoading() {
  return (
    <div className="min-h-screen bg-white mt-16">
      {/* Hero */}
      <section className="bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2 animate-pulse">
              <div className="h-3 w-40 rounded bg-white/10" />
              <div className="mt-4 h-9 w-3/4 rounded bg-white/15" />
              <div className="mt-3 h-4 w-full max-w-xl rounded bg-white/10" />
              <div className="mt-4 flex items-center gap-3">
                <div className="h-4 w-24 rounded bg-white/10" />
                <div className="h-4 w-20 rounded bg-white/10" />
                <div className="h-4 w-28 rounded bg-white/10" />
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-white/10" />
                <div className="h-4 w-24 rounded bg-white/10" />
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 bg-white shadow-xl animate-pulse">
              <div className="aspect-video w-full bg-gray-200" />
              <div className="p-5">
                <div className="h-7 w-28 rounded bg-gray-200" />
                <div className="mt-4 space-y-2">
                  <div className="h-11 w-full rounded-xl bg-gray-100" />
                  <div className="h-11 w-full rounded-xl bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 animate-pulse">
              <div className="border-b border-gray-200 flex gap-6">
                <div className="h-4 w-16 mb-4 rounded bg-gray-200" />
                <div className="h-4 w-20 mb-4 rounded bg-gray-100" />
                <div className="h-4 w-16 mb-4 rounded bg-gray-100" />
                <div className="h-4 w-20 mb-4 rounded bg-gray-100" />
              </div>

              <div className="mt-8 h-6 w-40 rounded bg-gray-200" />
              <div className="mt-4 h-28 w-full rounded-2xl border border-gray-200 bg-gray-50" />

              <div className="mt-10 h-6 w-48 rounded bg-gray-200" />
              <div className="mt-4 h-40 w-full rounded-xl border border-gray-200 bg-gray-50" />
            </div>

            <div className="hidden lg:block" />
          </div>
        </div>
      </section>
    </div>
  );
}
