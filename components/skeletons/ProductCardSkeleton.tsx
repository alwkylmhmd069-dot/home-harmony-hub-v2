const ProductCardSkeleton = () => {
  return (
    <div className="card-neon p-4 relative">
      {/* Image Skeleton */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-muted/30">
        <div className="absolute inset-0 shimmer-effect" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-3">
        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 rounded bg-muted/50 shimmer-effect" />
          ))}
          <div className="w-10 h-3 rounded bg-muted/50 ms-1 shimmer-effect" />
        </div>

        {/* Color dots */}
        <div className="flex gap-1.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-muted/50 shimmer-effect" />
          ))}
        </div>

        {/* Brand */}
        <div className="w-16 h-3 rounded bg-muted/50 shimmer-effect" />

        {/* Title */}
        <div className="space-y-1.5">
          <div className="w-full h-4 rounded bg-muted/50 shimmer-effect" />
          <div className="w-3/4 h-4 rounded bg-muted/50 shimmer-effect" />
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-6 rounded bg-muted/50 shimmer-effect" />
          <div className="w-16 h-4 rounded bg-muted/50 shimmer-effect" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
