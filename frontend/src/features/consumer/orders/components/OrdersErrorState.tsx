"use client";

interface OrdersErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export function OrdersErrorState({ error, onRetry }: OrdersErrorStateProps) {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mb-4 flex justify-center">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-2xl">!</span>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Orders</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
