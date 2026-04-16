import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeleton = ({ rows = 6 }: { rows?: number }) => (
  <div className="glass-panel-glow overflow-hidden">
    <div className="p-5 border-b border-border/40 space-y-3">
      <Skeleton className="h-5 w-48" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
    </div>
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  </div>
);

export default ProductSkeleton;
