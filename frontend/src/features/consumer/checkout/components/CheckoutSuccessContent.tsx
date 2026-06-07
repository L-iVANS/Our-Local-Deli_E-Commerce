import { CheckCircle, Home, FileText, Download } from 'lucide-react';

interface CheckoutSuccessContentProps {
  orderId: string | undefined;
  countdown: number;
  onBackHome: () => void;
  onViewInvoice: () => void;
  orderNumber?: string;
  orderAmount?: number;
}

export const CheckoutSuccessContent = ({
  orderId,
  countdown,
  onBackHome,
  onViewInvoice,
  orderNumber,
  orderAmount,
}: CheckoutSuccessContentProps) => {
  return (
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle size={48} className="text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Order Placed!</h1>
        <p className="text-gray-600">
          Your order has been received and is being processed.
        </p>
        <p className="text-sm text-gray-500">
          You'll receive a confirmation email shortly.
        </p>
      </div>

      {/* Order Reference */}
      {orderNumber && (
        <div className="bg-pink-50 rounded-lg p-6 border border-pink-200 text-center">
          <p className="text-sm text-gray-600 font-medium mb-2">ORDER REFERENCE</p>
          <p className="text-2xl font-bold text-red-600">{orderNumber}</p>
          <p className="text-xs text-gray-500 mt-2">Save this for tracking purposes</p>
        </div>
      )}

      {/* Total Amount Due */}
      {orderAmount && (
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <p className="text-sm text-gray-600 font-medium mb-2">TOTAL AMOUNT DUE</p>
          <p className="text-4xl font-bold text-blue-600 mb-2">
            ₱{orderAmount.toLocaleString('en-PH', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-gray-600">Payment confirmed via PayMongo</p>
        </div>
      )}

      {/* Payment Status */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <p className="text-sm text-green-800 font-medium">
          ✓ Payment has been successfully verified
        </p>
      </div>

      {/* What Happens Next */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <p className="text-sm font-semibold text-gray-900">WHAT HAPPENS NEXT</p>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-200 flex items-center justify-center">
              <span className="text-green-700 font-semibold text-sm">✓</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Order confirmed</p>
              <p className="text-sm text-gray-600">Our team will verify your order details.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center">
              <span className="text-blue-700 font-semibold text-sm">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Picking & packing</p>
              <p className="text-sm text-gray-600">Items are prepared at our warehouse.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center">
              <span className="text-blue-700 font-semibold text-sm">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Dispatched for delivery</p>
              <p className="text-sm text-gray-600">You'll receive tracking details via email.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBackHome}
          className="flex-1 py-3 rounded-lg font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Home size={18} />
          Back Home
        </button>
        <button
          onClick={onViewInvoice}
          className="flex-1 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Download size={18} />
          View Order
        </button>
      </div>

      {/* Auto-redirect message */}
      <p className="text-xs text-center text-gray-500">
        Redirecting to your orders in {countdown}s...
      </p>
    </div>
  );
};
