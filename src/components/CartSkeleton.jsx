import React from "react";

export default function CartSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-pulse">

      {/* Title */}
      <div className="h-6 w-40 bg-gray-300 rounded mb-6"></div>

      {/* Fake Cart Items */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex gap-4 bg-white p-4 shadow-md rounded-xl mb-4"
        >
          {/* Image */}
          <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div className="h-4 w-48 bg-gray-300 rounded"></div>
            <div className="h-3 w-32 bg-gray-300 rounded"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </div>

          {/* Qty */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="w-6 h-4 bg-gray-300 rounded"></div>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>

          {/* Delete */}
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      ))}

      {/* Order summary */}
      <div className="mt-8 bg-white p-5 shadow-lg rounded-xl space-y-4">
        <div className="h-5 w-44 bg-gray-300 rounded"></div>

        <div className="flex justify-between">
          <div className="h-4 w-28 bg-gray-300 rounded"></div>
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
        </div>

        <div className="h-10 w-full bg-gray-300 rounded"></div>
        <div className="h-10 w-full bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
