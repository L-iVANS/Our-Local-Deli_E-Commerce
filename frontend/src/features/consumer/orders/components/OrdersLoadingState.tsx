"use client";

export function OrdersLoadingState() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-red-600"></div>
        </div>
        <p className="text-gray-500">Loading orders...</p>
      </div>
    </div>
  );
}
