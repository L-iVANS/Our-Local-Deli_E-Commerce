'use client';

import { X, Package, ArrowRight, Lock, AlertTriangle, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  STATUS_FLOW,
  STATUS_LABELS,
} from "@/features/admin/sales-order/constants/statusFlow";

interface UpdateOrderStatusModalProps {
  isOpen: boolean;
  orderNumber: string;
  currentStatus: string;
  onClose: () => void;
  onUpdate: (newStatus: string) => Promise<void>;
  isLoading?: boolean;
}

export function UpdateOrderStatusModal({
  isOpen,
  orderNumber,
  currentStatus,
  onClose,
  onUpdate,
}: UpdateOrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmingDestructive, setConfirmingDestructive] = useState(false);

  const availableStatuses = STATUS_FLOW[currentStatus as keyof typeof STATUS_FLOW] || [];
  const hasSingleOption = availableStatuses.length === 1;

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setConfirmingDestructive(false);
      // ✅ Priority 2: Auto-select if there's only one option
      setSelectedStatus(hasSingleOption ? availableStatuses[0] : "");
    }
  }, [isOpen, hasSingleOption, availableStatuses]);

  if (!isOpen && !isAnimating) return null;

  // ✅ Theme-aware status colors
  const getStatusTheme = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("rejected") || s.includes("cancelled") || s.includes("failed")) {
      return {
        chip: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-700/40",
        selectedBorder: "border-red-500 dark:border-red-400",
        isDestructive: true,
      };
    }
    if (
      s.includes("pending") ||
      s.includes("processing") ||
      s.includes("transit") ||
      s.includes("awaiting") ||
      s.includes("billing") ||
      s.includes("packing")
    ) {
      return {
        chip: "bg-accent/15 text-accent border-accent/30 dark:bg-accent/25 dark:text-gold-light dark:border-gold/40",
        selectedBorder: "border-accent dark:border-gold",
        isDestructive: false,
      };
    }
    return {
      chip: "bg-primary/10 text-primary border-primary/30 dark:bg-primary/25 dark:text-gold-light dark:border-gold/40",
      selectedBorder: "border-primary dark:border-gold",
      isDestructive: false,
    };
  };

  // ✅ Priority 3: Contextual transition descriptions
  const getTransitionDescription = (from: string, to: string): string => {
    const key = `${from}→${to}`;
    const descriptions: Record<string, string> = {
      "PENDING_APPROVAL→ACCEPT": "The order will be confirmed and moved to fulfillment queue.",
      "ACCEPT→PACKING": "The warehouse team will be notified to prepare items for shipment.",
      "PACKING→IN_TRANSIT": "The order will be marked as dispatched. Customer will receive a tracking notification.",
      "IN_TRANSIT→DELIVERED": "Marks the order as completed and triggers the invoice/receipt.",
      "DELIVERED→PAID": "Confirms payment receipt and closes the order.",
    };

    if (key in descriptions) return descriptions[key];

    const toTheme = getStatusTheme(to);
    if (toTheme.isDestructive) {
      return "⚠️ This will release any reserved stock and notify the customer. This action cannot be easily reversed.";
    }
    return `The order status will change from ${STATUS_LABELS[from] || from} to ${STATUS_LABELS[to] || to}.`;
  };

  const currentTheme = getStatusTheme(currentStatus);
  const selectedTheme = selectedStatus ? getStatusTheme(selectedStatus) : null;
  const isDestructiveTransition = selectedTheme?.isDestructive ?? false;

  const handleSubmit = async () => {
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    // ✅ Priority 4: Require extra confirmation for destructive transitions
    if (isDestructiveTransition && !confirmingDestructive) {
      setConfirmingDestructive(true);
      return;
    }

    setLoading(true);
    try {
      await onUpdate(selectedStatus);
      toast.success(`Order now in ${STATUS_LABELS[selectedStatus] || selectedStatus} status`);
      onClose();
    } catch (err) {
      toast.error("Failed to update order status");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        onClick={onClose}
        onAnimationEnd={() => { if (!isOpen) setIsAnimating(false); }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative rounded-2xl max-w-lg w-full pointer-events-auto
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
          <div className="px-6 py-4 flex items-center justify-between rounded-t-2xl
                          border-b border-gray-200 dark:border-sidebar-border
                          bg-primary/5 dark:bg-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center
                              bg-white dark:bg-card
                              border border-gray-200 dark:border-sidebar-border
                              shadow-sm">
                <Package size={20} className="text-primary dark:text-gold-light" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold text-primary dark:text-gold-light">
                  Update Order Status
                </h2>
                {/* ✅ Priority bonus: bigger, monospaced order number */}
                <p className="text-xs font-mono font-semibold text-gray-600 dark:text-gold mt-0.5">
                  {orderNumber}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
              className="p-1.5 rounded-lg transition-colors
                         text-gray-500 hover:text-gray-800 hover:bg-gray-200
                         dark:text-muted-foreground dark:hover:text-gold dark:hover:bg-sidebar-accent
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">

            {/* ✅ Priority 1: Visual Transition Flow */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-muted-foreground text-center mb-3">
                Status Transition
              </p>
              <div className="flex items-center justify-center gap-3">
                {/* Current (read-only) */}
                <div className="flex-1 text-center">
                  <div className={`relative px-3 py-2.5 rounded-lg text-sm font-semibold border ${currentTheme.chip} opacity-80`}>
                    <span className="flex items-center justify-center gap-1.5">
                      <Lock size={11} className="opacity-60" />
                      {STATUS_LABELS[currentStatus] || currentStatus}
                    </span>
                  </div>
                  <p className="text-[10px] mt-1.5 text-gray-400 dark:text-muted-foreground uppercase tracking-wider font-medium">
                    Current
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight size={20} className="text-gray-400 dark:text-muted-foreground flex-shrink-0 mb-5" />

                {/* New */}
                <div className="flex-1 text-center">
                  <div className={[
                    "px-3 py-2.5 rounded-lg text-sm font-semibold border-2 transition-all",
                    selectedStatus
                      ? `${selectedTheme!.chip} ${selectedTheme!.selectedBorder}`
                      : "border-dashed border-gray-300 dark:border-sidebar-border bg-transparent text-gray-400 dark:text-muted-foreground",
                  ].join(" ")}>
                    {selectedStatus
                      ? STATUS_LABELS[selectedStatus] || selectedStatus
                      : "Select status…"}
                  </div>
                  <p className="text-[10px] mt-1.5 text-gray-400 dark:text-muted-foreground uppercase tracking-wider font-medium">
                    New Status
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ Priority 2: Only show selector if multiple options */}
            {availableStatuses.length === 0 && (
              <div className="px-4 py-3 rounded-lg text-sm
                              bg-gray-100 dark:bg-sidebar-accent
                              text-gray-600 dark:text-muted-foreground text-center">
                No status changes available for this order
              </div>
            )}

            {availableStatuses.length > 1 && (
              <div>
                <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-gold">
                  Choose Next Status
                </p>
                <div className="space-y-2">
                  {availableStatuses.map((status) => {
                    const theme = getStatusTheme(status);
                    const isSelected = selectedStatus === status;
                    return (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setConfirmingDestructive(false);
                        }}
                        disabled={loading}
                        className={[
                          "w-full px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all text-left",
                          isSelected
                            ? `${theme.chip} ${theme.selectedBorder}`
                            : "bg-white dark:bg-card border-gray-200 dark:border-sidebar-border text-gray-600 dark:text-muted-foreground hover:border-primary hover:text-primary dark:hover:border-gold dark:hover:text-gold",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                        ].join(" ")}
                      >
                        <span className="flex items-center gap-2">
                          {theme.isDestructive && <AlertTriangle size={14} />}
                          {STATUS_LABELS[status] || status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ✅ Priority 3: Contextual description */}
            {selectedStatus && (
              <div className={[
                "p-3 rounded-lg border-l-4 flex gap-2.5",
                isDestructiveTransition
                  ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                  : "border-primary bg-primary/5 dark:bg-primary/15",
              ].join(" ")}>
                {isDestructiveTransition ? (
                  <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                ) : (
                  <Info size={16} className="flex-shrink-0 mt-0.5 text-primary dark:text-gold-light" />
                )}
                <p className={[
                  "text-xs leading-relaxed",
                  isDestructiveTransition
                    ? "text-red-700 dark:text-red-300"
                    : "text-gray-600 dark:text-muted-foreground",
                ].join(" ")}>
                  {getTransitionDescription(currentStatus, selectedStatus)}
                </p>
              </div>
            )}

            {/* ✅ Priority 4: Extra confirmation for destructive */}
            {confirmingDestructive && (
              <div className="p-3 rounded-lg border-2 border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-700/50">
                <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">
                  ⚠️ Are you absolutely sure?
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  This action cannot be undone. Click "Confirm" again below to proceed.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 flex items-center justify-end gap-3
                          border-t border-gray-200 dark:border-sidebar-border">
            <button
              onClick={onClose}
              disabled={loading}
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
              onClick={handleSubmit}
              disabled={loading || !selectedStatus || availableStatuses.length === 0}
              className={[
                "px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2",
                "focus:outline-none focus:ring-2 active:scale-[0.98]",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                isDestructiveTransition
                  ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/30"
                  : "bg-primary text-[#F4F4F0] hover:bg-primary/90 hover:shadow-md focus:ring-primary/30",
              ].join(" ")}
            >
              {loading
                ? "Updating…"
                : confirmingDestructive
                ? "Confirm Status Change"
                : isDestructiveTransition
                ? "Continue"
                : hasSingleOption
                ? `Move to ${STATUS_LABELS[selectedStatus] || selectedStatus}`
                : "Update Status"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}