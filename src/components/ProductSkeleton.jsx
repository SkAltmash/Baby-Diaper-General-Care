import React from "react";

export default function ProductSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow-sm p-3">
      {/* Image skeleton */}
      <div className="w-full h-50 bg-gray-200 rounded-lg"></div>

      <div className="mt-3 space-y-2">
        <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
        <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
        <div className="w-1/4 h-3 bg-gray-200 rounded mt-2"></div>
      </div>
    </div>
  );
}
