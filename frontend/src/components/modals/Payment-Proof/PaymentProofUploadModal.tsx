"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { UploadForm } from "./UploadForm";
import { SuccessMessage } from "./SuccessMessage";

interface PaymentProofUploadModalProps {
  isOpen: boolean;
  orderId: string | number;
  attemptsRemaining?: number;
  onClose: () => void;
  onSubmit: (file: File) => Promise<void>;
}

export function PaymentProofUploadModal({
  isOpen,
  orderId,
  attemptsRemaining = 3,
  onClose,
  onSubmit,
}: PaymentProofUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when modal opens for re-upload
  useEffect(() => {
    if (isOpen) {
      // Clear any pending timeouts from previous operations
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Reset all state for fresh upload
      setSelectedFile(null);
      setPreview(null);
      setError(null);
      setSuccess(false);
      setIsLoading(false);
    } else {
      // Cleanup timeout if modal is closing
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(false);

    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = "Invalid file type. Please upload JPEG, PNG, WebP, or PDF.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Validate file size (4MB max)
    if (file.size > 4 * 1024 * 1024) {
      const errorMsg = "File size exceeds 4MB limit.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setSelectedFile(file);
    toast.success(`File selected: ${file.name}`);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      const errorMsg = "Please select a file.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);
    toast.loading("Uploading payment proof...");

    try {
      await onSubmit(selectedFile);
      setSuccess(true);
      toast.dismiss();
      toast.success("Payment proof uploaded successfully!");

      // Close modal after 2 seconds of success
      timeoutRef.current = setTimeout(() => {
        resetAndClose();
      }, 2000);
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to upload payment proof. Please try again.";
      setError(errorMsg);
      toast.dismiss();
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={resetAndClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors z-10"
          disabled={isLoading}
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Content */}
        {success ? (
          <SuccessMessage />
        ) : (
          <UploadForm
            orderId={orderId}
            selectedFile={selectedFile}
            preview={preview}
            error={error}
            isLoading={isLoading}
            attemptsRemaining={attemptsRemaining}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
            onCancel={resetAndClose}
          />
        )}
      </div>
    </div>
  );
}
