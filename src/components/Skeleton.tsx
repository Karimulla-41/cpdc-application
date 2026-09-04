import React from 'react';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className || 'h-4 w-full'}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}
