import { X } from "lucide-react";

interface ModalHeaderProps {
  onClose: () => void;
}

export function ModalHeader({ onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
      <div>
        <h2
          className="text-gray-900 font-bold"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem" }}
        >
          Review & Confirm Order
        </h2>
        <p className="text-gray-400 text-xs mt-0.5">Verify all details before placing your order.</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-300 hover:text-gray-600 transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  );
}
