/**
 * Skeleton loader components for various UI elements
 */

export const GigCardSkeleton = () => (
  <div className="card">
    <div className="skeleton h-48 w-full rounded-xl mb-4" />
    <div className="flex items-center gap-2 mb-3">
      <div className="skeleton w-8 h-8 rounded-full" />
      <div className="skeleton h-4 w-24 rounded" />
    </div>
    <div className="skeleton h-5 w-full rounded mb-2" />
    <div className="skeleton h-5 w-3/4 rounded mb-4" />
    <div className="skeleton h-4 w-1/2 rounded mb-3" />
    <div className="flex justify-between items-center mt-4 pt-4 border-t border-surface-border">
      <div className="skeleton h-6 w-16 rounded" />
      <div className="skeleton h-4 w-20 rounded" />
    </div>
  </div>
);

export const GigDetailSkeleton = () => (
  <div className="animate-fade-in">
    <div className="skeleton h-80 w-full rounded-2xl mb-8" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="skeleton h-8 w-3/4 rounded" />
        <div className="skeleton h-5 w-1/2 rounded" />
        <div className="skeleton h-40 w-full rounded" />
      </div>
      <div className="card space-y-4">
        <div className="skeleton h-8 w-1/3 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-12 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

export const DashboardStatSkeleton = () => (
  <div className="card space-y-3">
    <div className="flex justify-between items-center">
      <div className="skeleton h-4 w-24 rounded" />
      <div className="skeleton w-10 h-10 rounded-xl" />
    </div>
    <div className="skeleton h-8 w-16 rounded" />
    <div className="skeleton h-3 w-32 rounded" />
  </div>
);

export const TableRowSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 card">
        <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
    ))}
  </div>
);

export default GigCardSkeleton;
