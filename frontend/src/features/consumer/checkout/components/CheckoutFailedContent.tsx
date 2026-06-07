import { AlertCircle, Home, RotateCw } from 'lucide-react';

interface CheckoutFailedContentProps {
  orderId: string | null;
  onBackHome: () => void;
  onRetryPayment: () => void;
  retryDisabled?: boolean;
}

export const CheckoutFailedContent = ({
  orderId,
  onBackHome,
  onRetryPayment,
  retryDisabled,
}: CheckoutFailedContentProps) => {
  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
      <div className="flex justify-center">
        <div className="rounded-full bg-red-100 p-4">
          <AlertCircle size={48} className="text-red-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
        <p className="text-gray-600">
          Unfortunately, your payment could not be processed. Please try again or use a different payment method.
        </p>
      </div>

      {orderId && (
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-gray-600 mb-1">Order ID</p>
          <p className="text-lg font-semibold text-red-600">#{orderId}</p>
        </div>
      )}

      <div className="bg-yellow-50 rounded-lg p-4 space-y-2 border border-yellow-200">
        <p className="text-sm text-gray-700">
          <strong>Why did this happen?</strong>
        </p>
        <ul className="text-sm text-gray-600 space-y-1 text-left">
          <li>• Insufficient funds in your account</li>
          <li>• Card declined by your bank</li>
          <li>• Network connectivity issue</li>
          <li>• Invalid payment details</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBackHome}
          className="flex-1 py-2.5 rounded-lg font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Home size={18} />
          Back Home
        </button>
        <button
          onClick={onRetryPayment}
          disabled={retryDisabled}
          className="flex-1 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <RotateCw size={18} />
          Retry Payment
        </button>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          For assistance, contact our support team at{' '}
          <a href="mailto:support@synchores.com" className="text-blue-600 hover:underline">
            support@synchores.com
          </a>
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 space-y-2">
        <p className="text-sm font-semibold text-gray-700">
          Don't want to use online payment?
        </p>
        <p className="text-xs text-gray-600 mb-3">
          You can submit a manual payment proof instead. Our team will verify it within 24 hours.
        </p>
        <button className="w-full py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors text-sm">
          Upload Payment Proof
        </button>
      </div>
    </div>
  );
};
