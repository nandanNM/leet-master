function ProfileHeaderSkeleton() {
  return (
    <div className="from-muted/50 to-muted relative mb-8 overflow-hidden rounded-2xl border bg-gradient-to-br p-8">
      <div className="bg-grid-black/[0.04] dark:bg-grid-white/[0.02] absolute inset-0 bg-[size:32px]" />
      <div className="relative flex items-center gap-8">
        {/* Avatar Skeleton */}
        <div className="relative">
          <div className="from-primary/20 to-secondary/20 absolute inset-0 rounded-full bg-gradient-to-r blur-xl" />
          <div className="border-border bg-muted relative z-10 h-24 w-24 animate-pulse rounded-full border-4" />
          <div className="absolute -top-2 -right-2 z-20 h-8 w-8 animate-pulse rounded-full bg-gradient-to-r from-purple-500/50 to-purple-600/50" />
        </div>

        {/* User Info Skeleton */}
        <div className="space-y-3">
          <div className="bg-muted h-8 w-48 animate-pulse rounded" />
          <div className="bg-muted h-5 w-32 animate-pulse rounded" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="group bg-muted/50 relative overflow-hidden rounded-xl border p-4"
          >
            <div className="from-primary to-secondary absolute inset-0 bg-gradient-to-br opacity-5" />
            <div className="relative space-y-4">
              {/* Stat Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                  <div className="bg-muted h-8 w-16 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                </div>
                <div className="bg-muted h-10 w-10 animate-pulse rounded-xl" />
              </div>

              {/* Stat Footer */}
              <div className="border-border flex items-center gap-2 border-t pt-4">
                <div className="bg-muted h-4 w-4 animate-pulse rounded" />
                <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                <div className="bg-muted h-4 w-16 animate-pulse rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileHeaderSkeleton;
