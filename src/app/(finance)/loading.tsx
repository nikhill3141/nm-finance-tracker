export default function FinanceLoading() {
  return (
    <section className="animate-in space-y-6">
      <div className="space-y-3">
        <div className="h-4 w-28 rounded-full bg-slate-200" />
        <div className="h-9 w-48 rounded-lg bg-slate-200" />
        <div className="h-4 w-full max-w-sm rounded-full bg-slate-200" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="panel space-y-4 p-5">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded-full bg-slate-200" />
              <div className="size-10 rounded-full bg-slate-200" />
            </div>
            <div className="h-8 w-36 rounded-lg bg-slate-200" />
          </div>
        ))}
      </div>
    </section>
  );
}
