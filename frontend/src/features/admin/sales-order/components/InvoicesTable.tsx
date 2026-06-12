'use client';

import { useState } from "react";
import { Eye, X } from "lucide-react";

interface Invoice {
  id: string;
  billingDocNo: string;
  customerName: string;
  customerNo: string;
  salesOrderRef: string;
  billingDate: string;
  dueDate: string;
  grossAmount: number;
  paidAmount: number;
  balanceDue: number;
  paymentStatus: "Open" | "Cleared" | "Overdue" | "Partially Paid";
}

function StatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, { bg: string; text: string; color: string }> = {
    Open: { bg: "#fffbeb", text: "#d97706", color: "#d97706" },
    Cleared: { bg: "#ecfdf5", text: "#16a34a", color: "#16a34a" },
    Overdue: { bg: "#fef2f2", text: "#dc2626", color: "#dc2626" },
    "Partially Paid": { bg: "#fef3c7", text: "#d97706", color: "#d97706" },
  };

  const style = statusColors[status] || statusColors["Open"];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.color}30`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.color }} />
      {status}
    </span>
  );
}

interface InvoicesTableProps {
  invoices: Invoice[];
  emptyMessage?: string;
  onViewDetails?: (invoice: Invoice) => void;
  onApprovePayment?: (invoice: Invoice) => void;
}

export function InvoicesTable({
  invoices,
  emptyMessage = "No invoices found",
  onViewDetails,
  onApprovePayment,
}: InvoicesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination calculations
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = invoices.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm" style={{ minWidth: "100%" }}>
          <thead>
            <tr
              className="border-b border-gray-100"
              style={{ backgroundColor: "#fafafa" }}
            >
              {[
                "Doc No.",
                "Customer",
                "SO Ref",
                "Billing Date",
                "Due Date",
                "Gross Amt.",
                "Paid",
                "Balance",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedInvoices.length > 0 ? (
              paginatedInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-600 whitespace-nowrap">
                    {invoice.billingDocNo}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-800 whitespace-nowrap">
                      {invoice.customerName}
                    </div>
                    <div className="text-xs text-gray-400">{invoice.customerNo}</div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-500 whitespace-nowrap">
                    {invoice.salesOrderRef}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                    {invoice.billingDate}
                  </td>
                  <td
                    className="px-5 py-3.5 font-medium whitespace-nowrap"
                    style={{
                      color:
                        invoice.paymentStatus === "Overdue"
                          ? "#dc2626"
                          : "#374151",
                    }}
                  >
                    {invoice.dueDate}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-gray-800 whitespace-nowrap">
                    ₱{invoice.grossAmount.toLocaleString("en-PH")}
                  </td>
                  <td className="px-5 py-3.5 text-green-600 font-medium whitespace-nowrap">
                    ₱{invoice.paidAmount.toLocaleString("en-PH")}
                  </td>
                  <td
                    className="px-5 py-3.5 font-semibold whitespace-nowrap"
                    style={{
                      color:
                        invoice.balanceDue > 0
                          ? invoice.paymentStatus === "Overdue"
                            ? "#dc2626"
                            : "#d97706"
                          : "#16a34a",
                    }}
                  >
                    ₱{invoice.balanceDue.toLocaleString("en-PH")}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <StatusBadge status={invoice.paymentStatus} />
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onViewDetails?.(invoice)}
                        className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-gray-400 hover:text-blue-600"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {invoice.paymentStatus !== "Cleared" && (
                        <button
                          onClick={() => onApprovePayment?.(invoice)}
                          className="p-2 rounded-lg hover:bg-green-50 transition-colors text-gray-400 hover:text-green-600"
                          title="Approve Payment"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="px-5 py-8 text-center text-sm text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderTop: "1px solid #f1f5f9", background: "#fafafa" }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors"
            style={{
              borderColor: currentPage === 1 ? "#e5e7eb" : "#d1d5db",
              color: currentPage === 1 ? "#d1d5db" : "#6b7280",
              backgroundColor: currentPage === 1 ? "#f3f4f6" : "white",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            ← Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
                style={{
                  backgroundColor: currentPage === page ? "#bf262f" : "#f3f4f6",
                  color: currentPage === page ? "white" : "#6b7280",
                  border: currentPage === page ? "1px solid #bf262f" : "1px solid #e5e7eb",
                  cursor: "pointer",
                }}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors"
            style={{
              borderColor: currentPage === totalPages ? "#e5e7eb" : "#d1d5db",
              color: currentPage === totalPages ? "#d1d5db" : "#6b7280",
              backgroundColor: currentPage === totalPages ? "#f3f4f6" : "white",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next →
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "#6b7280" }}>
          Showing {startIndex + 1}-{Math.min(endIndex, invoices.length)} of{" "}
          {invoices.length} invoices
        </p>
      </div>
    </div>
  );
}
