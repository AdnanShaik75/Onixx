export default function Loading() {
  return (
    <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <div className="h-3 w-24 bg-card rounded mx-auto animate-pulse" />
            <div className="h-12 w-96 bg-card rounded mx-auto animate-pulse" />
            <div className="h-4 w-64 bg-card rounded mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-card rounded-[2px] animate-pulse" />
                <div className="h-3 w-16 bg-card rounded animate-pulse" />
                <div className="h-4 w-32 bg-card rounded animate-pulse" />
                <div className="h-4 w-20 bg-card rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
