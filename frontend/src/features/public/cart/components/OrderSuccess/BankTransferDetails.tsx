import { useState } from "react";
import { ChevronDown, Copy, AlertCircle, Upload } from "lucide-react";
import { toast } from "sonner";

const RED = "#bf262f";

interface BankAccount {
  bank: string;
  accountName: string;
  accountNumber: string;
  reference: string;
}

interface BankTransferDetailsProps {
  bankAccount: BankAccount;
  resolvedOrderId: number | null;
  onUploadClick: () => void;
}

export function BankTransferDetails({
  bankAccount,
  resolvedOrderId,
  onUploadClick,
}: BankTransferDetailsProps) {
  const [isBankDetailsOpen, setIsBankDetailsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  console.log("BankTransferDetails component loaded - UPDATED FILE");

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(bankAccount.accountNumber);
    setIsCopied(true);
    toast.success("Account number copied!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Bank Details - Collapsible */}
      <button
        onClick={() => setIsBankDetailsOpen(!isBankDetailsOpen)}
        className="w-full rounded-xl p-4 border text-left transition-all"
        style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Bank Transfer Details
            </div>
            <div className="text-sm font-medium text-gray-800">
              {bankAccount.bank} • {bankAccount.accountName}
            </div>
          </div>
          <ChevronDown
            size={18}
            style={{ color: "#9ca3af" }}
            className={`transition-transform ${isBankDetailsOpen ? "rotate-180" : ""}`}
          />
        </div>

        {/* Expanded Details */}
        {isBankDetailsOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2.5">
            <div>
              <div className="text-xs text-gray-400 mb-0.5">Bank Name</div>
              <div className="text-sm font-medium text-gray-800">{bankAccount.bank}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-0.5">Account Name</div>
              <div className="text-sm font-medium text-gray-800">{bankAccount.accountName}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-0.5">Account Number</div>
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-mono font-medium text-gray-800 flex-1 break-all">
                  {bankAccount.accountNumber}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyAccountNumber();
                  }}
                  className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors shrink-0 cursor-pointer"
                >
                  <Copy size={14} style={{ color: RED }} />
                </div>
              </div>
              {isCopied && <div className="text-xs text-green-600 mt-1">Copied!</div>}
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-0.5">Reference/Remarks</div>
              <div className="text-sm font-medium text-gray-800">{bankAccount.reference}</div>
            </div>
          </div>
        )}
      </button>

      {/* Upload Payment Proof - Independent Section */}
      <div className="rounded-xl p-4 border mb-6" style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}>
        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Proof of Order
          </div>
          <div className="text-sm font-medium text-gray-800">Upload Proof of Payment or the Purchase Order</div>
        </div>

        {resolvedOrderId ? (
          <button
            onClick={onUploadClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            style={{ backgroundColor: "#374151", color: "#ffffff" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1f2937")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#374151")}
          >
            <Upload size={14} />
            Upload 
          </button>
        ) : (
          <div
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: "#fee2e2", color: "#991b1b" }}
          >
            <AlertCircle size={14} />
            Order ID Missing - Please Refresh
          </div>
        )}
      </div>
    </div>
  );
}
