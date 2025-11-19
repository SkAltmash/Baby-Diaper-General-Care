import React from "react";

export default function ProductDetailsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* IMAGE SKELETON */}
        <div>
          <div className="w-full h-80 md:h-130 bg-gray-200 rounded-xl"></div>

          {/* Thumbnail skeleton */}
          <div className="flex gap-3 mt-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* INFO SKELETON */}
        <div>
          <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
          <div className="h-3 w-1/3 bg-gray-200 rounded mt-2"></div>

          <div className="mt-4">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded mt-1"></div>
            <div className="h-4 w-40 bg-gray-200 rounded mt-1"></div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>

          {/* Variant buttons skeleton */}
          <div className="mt-6 flex gap-3">
            <div className="w-20 h-16 bg-gray-200 rounded-lg"></div>
            <div className="w-20 h-16 bg-gray-200 rounded-lg"></div>
          </div>

          <div className="mt-6">
            <div className="h-10 w-40 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-10">
        <div className="h-5 w-40 bg-gray-200 rounded"></div>
        <div className="h-3 w-full bg-gray-200 rounded mt-3"></div>
        <div className="h-3 w-3/4 bg-gray-200 rounded mt-2"></div>
      </div>
    </div>
  );
}
