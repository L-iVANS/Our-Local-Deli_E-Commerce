'use client';

import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ArchiveConfirmDialogProps {
  isOpen: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ArchiveConfirmDialog({
  isOpen,
  productName,
  onConfirm,
  onCancel,
  isLoading = false,
}: ArchiveConfirmDialogProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) setIsAnimating(true);
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed top-0 left-0 w-screen h-screen z-40 bg-black/50"
        style={{
          animation: isOpen
            ? "fadeIn 0.2s ease-out"
            : "fadeOut 0.2s ease-out forwards",
        }}
        onClick={onCancel}
        onAnimationEnd={() => { if (!isOpen) setIsAnimating(false); }}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="rounded-2xl overflow-hidden w-full max-w-sm pointer-events-auto
                     bg-white dark:bg-card
                     border border-gray-200 dark:border-sidebar-border
                     shadow-2xl"
          style={{
            animation: isOpen
              ? "slideUp 0.3s ease-out"
              : "slideDown 0.2s ease-out forwards",
          }}
          onAnimationEnd={() => { if (!isOpen) setIsAnimating(false); }}
        >
          <style>{`
            @keyframes fadeIn   { from { opacity: 0 } to { opacity: 1 } }
            @keyframes fadeOut  { from { opacity: 1 } to { opacity: 0 } }
            @keyframes slideUp  { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
            @keyframes slideDown{ from { opacity: 1; transform: translateY(0)   } to { opacity: 0; transform: translateY(20px) } }
          `}</style>

          {/* Header */}
          <div className="px-6 py-5
                          border-b border-gray-200 dark:border-sidebar-border
                          ">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                              bg-white dark:bg-card
                              border border-gray-200 dark:border-sidebar-border
                              shadow-sm">
                <AlertCircle size={20} className="text-primary dark:text-gold-light" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-primary dark:text-gold-light">
                Archive Product?
              </h3>
            </div>
            <p className="text-sm mt-2 text-gray-600 dark:text-muted-foreground">
              You&apos;re about to archive{" "}
              <strong className="text-gray-900 dark:text-gold">{productName}</strong>.
              This action cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 flex items-center justify-end gap-3
                          border-t border-gray-200 dark:border-sidebar-border">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors
                         border-gray-200 dark:border-sidebar-border
                         bg-gray-50 dark:bg-card
                         text-gray-700 dark:text-gold
                         hover:bg-gray-100 dark:hover:bg-sidebar-accent
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all
                         bg-primary text-[#F4F4F0]
                         hover:bg-primary/90 hover:shadow-md
                         focus:outline-none focus:ring-2 focus:ring-primary/30
                         active:scale-[0.98]
                         disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Archiving..." : "Archive"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}