interface ModalFooterProps {
  onClose: () => void;
  onPlaceOrder: () => void;
  placing: boolean;
  redColor: string;
}

export function ModalFooter({ onClose, onPlaceOrder, placing, redColor }: ModalFooterProps) {
  return (
    <div className="flex gap-3 px-6 py-5 border-t border-gray-100">
      <button
        onClick={onClose}
        className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onPlaceOrder}
        disabled={placing}
        className="flex-1 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ backgroundColor: redColor }}
      >
        {placing ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>Confirm Order</>
        )}
      </button>
    </div>
  );
}
