'use client';

import { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';

interface PaymongoCheckoutModalProps {
  isOpen: boolean;
  orderId: number;
  orderAmount: number;
  orderNumber?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

interface InitiatePaymongoCheckoutResponse {
  initiatePaymongoCheckout: {
    success: boolean;
    paymentIntentId: string;
    checkoutUrl: string;
    message: string;
  };
}

const INITIATE_PAYMONGO_CHECKOUT = gql`
  mutation InitiatePaymongoCheckout($orderId: Int!) {
    initiatePaymongoCheckout(orderId: $orderId) {
      success
      paymentIntentId
      checkoutUrl
      message
    }
  }
`;

export function PaymongoCheckoutModal({
  isOpen,
  orderId,
  orderAmount,
  orderNumber,
  onClose,
  onSuccess,
}: PaymongoCheckoutModalProps) {
  console.log("[PaymongoCheckoutModal] ⭐ COMPONENT RENDERING - isOpen:", isOpen, "orderId:", orderId);
  
  const [initiateCheckout, { loading }] = useMutation<InitiatePaymongoCheckoutResponse>(INITIATE_PAYMONGO_CHECKOUT);

  // Log whenever props change
  useEffect(() => {
    console.log("[PaymongoCheckoutModal] Props changed:", {
      isOpen,
      orderId,
      orderAmount,
      orderNumber,
    });
  }, [isOpen, orderId, orderAmount, orderNumber]);

  const handlePayWithPaymongo = async () => {
    try {
      console.log("[PaymongoCheckoutModal] Pay button clicked, initiating checkout for orderId:", orderId);
      toast.loading('Preparing payment...');

      const response = await initiateCheckout({
        variables: {
          orderId,
        },
      });

      const { data } = response;

      if (!data?.initiatePaymongoCheckout?.checkoutUrl) {
        throw new Error('Failed to get checkout URL');
      }

      toast.dismiss();
      toast.success('Redirecting to payment gateway...');

      // Redirect to PayMongo checkout
      setTimeout(() => {
        window.location.href = data.initiatePaymongoCheckout.checkoutUrl;
      }, 500);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.dismiss();
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to initiate payment';
      toast.error(errorMessage);
      console.error('PayMongo checkout error:', error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors z-10"
          disabled={loading}
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Checkout Payment
            </h2>
            {orderNumber && (
              <p className="text-sm text-gray-500">Order #{orderNumber}</p>
            )}
          </div>

          {/* Amount Card */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-4xl font-bold text-blue-600">
              ₱{orderAmount.toLocaleString('en-PH', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Payment Methods Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-700">
              Accepted Payment Methods:
            </p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>💳 Credit/Debit Cards (Visa, Mastercard, JCB)</p>
              <p>📱 E-Wallets (GCash, PayMaya, Shopee Pay, Grab Pay)</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-lg font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePayWithPaymongo}
              disabled={loading}
              className="flex-1 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader size={18} className="animate-spin" />}
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>

          {/* Footer Text */}
          <p className="text-xs text-gray-500 text-center">
            You will be redirected to PayMongo's secure payment gateway. Your
            payment information is encrypted and safe.
          </p>
        </div>
      </div>
    </div>
  );
}
