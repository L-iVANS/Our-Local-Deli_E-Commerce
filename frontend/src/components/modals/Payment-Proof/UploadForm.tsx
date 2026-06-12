"use client";

import { Upload as UploadIcon } from "lucide-react";

interface UploadFormProps {
  orderId: string | number;
  selectedFile: File | null;
  preview: string | null;
  error: string | null;
  isLoading: boolean;
  attemptsRemaining?: number;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function UploadForm({
  orderId,
  selectedFile,
  preview,
  error,
  isLoading,
  attemptsRemaining = 3,
  onFileChange,
  onSubmit,
  onCancel,
}: UploadFormProps) {
  const isDisabled = attemptsRemaining <= 0;
  
  return (
    <div className="p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Payment Proof</h2>
      <p className="text-gray-600 text-sm mb-4">Order #{orderId}</p>

      {/* File input area */}
      <label className={`block border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
        isDisabled ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-gray-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50'
      }`}>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={onFileChange}
          disabled={isLoading || isDisabled}
          className="hidden"
        />
        <div className="flex justify-center mb-2">
          <UploadIcon size={28} className="text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-700">
          Click to select or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP, or PDF (Max 4MB)</p>
      </label>

      {/* File preview */}
      {selectedFile && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-600 mb-2">
            Selected: {selectedFile.name}
          </p>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-48 object-contain rounded-lg border border-gray-200"
            />
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Disabled message */}
      {isDisabled && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
          <p className="text-sm text-red-600 mt-1">Your order has been cancelled due to failed payment verification attempts. Please contact support to place a new order.</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-2.5 rounded-lg font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={isLoading || !selectedFile || isDisabled}
          className="flex-1 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
