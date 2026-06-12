"use client";

import { Check } from "lucide-react";

export function SuccessMessage() {
  return (
    <div className="p-6 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100">
          <Check size={28} className="text-green-600" />
        </div>
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-2">Upload Successful!</h2>
      <p className="text-gray-600 text-sm">
        Your payment proof has been submitted for verification.
      </p>
    </div>
  );
}
