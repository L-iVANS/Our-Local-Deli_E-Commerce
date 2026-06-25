import { AlertCircle, Download, RotateCcw, ExternalLink, Upload } from "lucide-react";
import type { Order } from "../types/order";
import { formatDateWithTime2DigitYear } from "@/utils/dateFormatter";

interface OrderDetailsProps {
  order: Order;
  onReUploadClick?: () => void;
}

export function OrderDetails({ order, onReUploadClick }: OrderDetailsProps) {
  return (
    <div className="px-5 pb-5 pt-0 bg-slate-50">
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          {/* Order info */}
          <div className="p-4 border-r border-slate-200">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Order Info
            </div>
            {[
              { label: "Order ID", val: order.id },
              { label: "Order Date", val: formatDateWithTime2DigitYear(order.date) },
              { label: "Delivery", val: order.deliveryMethod },
            ].map(({ label, val }) => (
              <div key={label} className="mb-2">
                <div className="text-xs text-gray-400">{label}</div>
                <div className="text-xs font-medium text-gray-700 font-mono">{val}</div>
              </div>
            ))}
            {order.notes && (
              <div className="mt-2 p-2.5 rounded-lg text-xs text-gray-600 bg-yellow-50 border border-yellow-200">
                <AlertCircle
                  size={11}
                  className="inline mr-1 text-amber-600"
                />
                {order.notes}
              </div>
            )}
            {order.paymentProofStatus === "rejected" && (
              <div className="mt-2 p-3 rounded-lg bg-red-50 border border-red-300">
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle size={14} className="text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-red-700 mb-1">Payment Proof Rejected</div>
                    <div className="text-xs text-red-600 mb-2">
                      <span className="font-medium">Reason:</span> {order.paymentProofRejectionReason || "Not specified"}
                    </div>
                    <div className="text-xs text-red-600 mb-3">
                      <span className="font-medium">Attempts:</span> {(order.paymentProofAttempts || 0)}/3
                    </div>
                    {(order.paymentProofAttempts || 0) < 3 ? (
                      <button
                        onClick={onReUploadClick}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors"
                      >
                        <Upload size={12} /> Re-upload Payment Proof
                      </button>
                    ) : (
                      <div className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded">
                        Maximum attempts reached
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {order.paymentProofImage && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Payment Proof
                </div>
                <div className="rounded-lg border border-slate-200 overflow-hidden bg-white">
                  <img
                    src={order.paymentProofImage}
                    alt="Payment Proof"
                    className="w-full h-auto max-h-64 object-cover rounded"
                    style={{ minHeight: '200px' }}
                  />
                </div>
                <a
                  href={order.paymentProofImage}
                  download
                  className="flex items-center gap-1.5 mt-2 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <ExternalLink size={11} /> Download
                </a>
              </div>
            )}
          </div>

          {/* Line items */}
          <div className="p-4 sm:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Line Items
            </div>
            <table className="w-full" style={{ tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "12%" }} />
                <col style={{ width: "40%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "18%" }} />
              </colgroup>
              <thead>
                <tr>
                  {["SKU", "Product", "Qty", "Unit Price", "Total"].map((h) => (
                    <th
                      key={h}
                      className="text-right pb-2 text-gray-400 font-semibold text-[0.65rem]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.sku} className="border-t border-slate-100">
                    <td className="py-2 pr-3 font-mono text-gray-500 text-[0.7rem] text-right">
                      {item.sku}
                    </td>
                    <td className="py-2 pr-3 text-gray-700 text-[0.75rem]text-right">
                      {item.name}
                    </td>
                    <td className="py-2 pr-3 text-right text-gray-600 text-[0.75rem] ">
                      {item.qty}
                    </td>
                    <td className="py-2 pr-3 text-right text-gray-600 text-[0.75rem]">
                      ₱{item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-2 text-right font-semibold text-gray-800 text-[0.75rem]">
                      ₱{item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200">
                  <td colSpan={3} />
                  <td className="pt-2 text-xs text-gray-500 text-right">Subtotal</td>
                  <td className="pt-2 text-xs font-medium text-gray-700 text-right">
                    ₱{order.subtotal.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} />
                  <td className="text-xs text-gray-500 text-right">Delivery Fee</td>
                  <td className="text-xs font-medium text-gray-700 text-right">
                    {(order as any).deliveryFee === 0 || (order as any).deliveryFee === undefined ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      <span>₱{((order as any).deliveryFee || 0).toLocaleString()}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} />
                  <td className="text-xs text-gray-500 text-right">VAT (12%)</td>
                  <td className="text-xs font-medium text-gray-700 text-right">
                    ₱{order.vat.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} />
                  <td className="pt-1 text-xs font-bold text-gray-800 text-right">Total</td>
                  <td className="pt-1 text-sm font-bold text-right text-red-700">
                    ₱{order.total.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div className="flex gap-2 mt-4 justify-end">
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-gray-100 transition-colors">
                <Download size={12} /> Download PDF
              </button>
              {order.status === "DELIVERED" && (
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-700 text-white text-xs font-semibold hover:opacity-90 transition-all">
                  <RotateCcw size={12} /> Reorder
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
