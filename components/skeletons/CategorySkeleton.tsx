const CategorySkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl aspect-square bg-muted/30">
      {/* Background shimmer */}
      <div className="absolute inset-0 shimmer-effect" />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
        {/* Icon placeholder */}
        <div className="w-12 h-12 rounded-xl bg-muted/50 mb-3 shimmer-effect" />
        
        {/* Title placeholder */}
        <div className="w-24 h-5 rounded bg-muted/50 mb-2 shimmer-effect" />
        
        {/* Count placeholder */}
        <div className="w-16 h-4 rounded bg-muted/50 shimmer-effect" />
      </div>
    </div>
  );
};

export default CategorySkeleton;
