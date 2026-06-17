import { MapPin, AlertCircle } from "lucide-react";
import type { KeyboardEvent } from "react";
import { DeliveryDetails } from "../../types";

interface DeliveryFormProps {
  delivery: DeliveryDetails;
  errors: Partial<DeliveryDetails>;
  minDeliveryDate: string;
  primaryAddress?: string;
  onDeliveryChange: (field: keyof DeliveryDetails, value: string | boolean) => void;
}

const BLUE_COLOR = "#3b82f6";

export function DeliveryForm({
  delivery,
  errors,
  minDeliveryDate,
  primaryAddress,
  onDeliveryChange,
}: DeliveryFormProps) {
  const handleContactNumberChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 11);

    if (digitsOnly.length === 1 && digitsOnly !== "0") return;
    if (digitsOnly.length === 2 && digitsOnly !== "09") return;
    if (digitsOnly.length > 2 && !digitsOnly.startsWith("09")) return;

    onDeliveryChange("contactNumber", digitsOnly);
  };

  const handleDeliveryDateChange = (value: string) => {
    if (!value) {
      onDeliveryChange("deliveryDate", value);
      return;
    }

    if (value < minDeliveryDate) {
      onDeliveryChange("deliveryDate", minDeliveryDate);
      return;
    }

    onDeliveryChange("deliveryDate", value);
  };

  const handleDeliveryDateKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Tab",
      "Escape",
      "Enter",
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ];

    if (allowedKeys.includes(event.key)) return;

    event.preventDefault();
  };

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        <MapPin size={12} className="inline mr-1" />
        Delivery Details
      </div>

      {/* Address Selection - Radio Buttons */}
      <div className="space-y-3">
        {/* Radio 1: Use Registered Address */}
        <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border cursor-pointer hover:bg-gray-100 transition-colors" style={{ borderColor: delivery.usePrimaryAddress ? BLUE_COLOR : "#e5e7eb" }}>
          <input
            type="radio"
            name="addressOption"
            checked={delivery.usePrimaryAddress ?? true}
            onChange={() => onDeliveryChange("usePrimaryAddress", true)}
            className="h-3 w-3 mt-0.5 shrink-0 cursor-pointer"
            style={{ accentColor: BLUE_COLOR }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-700">Use Registered Address</div>
            {primaryAddress ? (
              <div className="text-xs text-gray-600 mt-1">{primaryAddress}</div>
            ) : (
              <div className="text-xs text-gray-400 italic">No registered address on file</div>
            )}
          </div>
        </label>

        {/* Radio 2: Type an Address */}
        <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border cursor-pointer hover:bg-gray-100 transition-colors" style={{ borderColor: !delivery.usePrimaryAddress ? BLUE_COLOR : "#e5e7eb" }}>
          <input
            type="radio"
            name="addressOption"
            checked={!delivery.usePrimaryAddress}
            onChange={() => onDeliveryChange("usePrimaryAddress", false)}
            className="h-3 w-3 mt-0.5 shrink-0 cursor-pointer"
            style={{ accentColor: BLUE_COLOR }}
          />
          <div className="text-xs font-medium text-gray-700">Type a Different Address</div>
        </label>

        {/* Address Input - Only show when 2nd radio is selected */}
        {!delivery.usePrimaryAddress && (
          <div className="mt-3">
            <input
              type="text"
              value={delivery.address}
              onChange={(e) => onDeliveryChange("address", e.target.value)}
              placeholder="Enter your delivery address"
              className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors"
              style={{ borderColor: errors.address ? "#ef4444" : "#e5e7eb" }}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={11} />
                {errors.address}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">
            Contact Person <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="text"
            value={delivery.contactPerson}
            onChange={(e) => onDeliveryChange("contactPerson", e.target.value)}
            placeholder="Name"
            className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none"
            style={{ borderColor: errors.contactPerson ? "#ef4444" : "#e5e7eb" }}
          />
          {errors.contactPerson && (
            <p className="text-red-500 text-xs mt-1">{errors.contactPerson}</p>
          )}
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">
            Contact Number <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="tel"
            value={delivery.contactNumber}
            onChange={(e) => handleContactNumberChange(e.target.value)}
            placeholder="+63 9XX XXX XXXX"
            inputMode="numeric"
            maxLength={11}
            className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none"
            style={{ borderColor: errors.contactNumber ? "#ef4444" : "#e5e7eb" }}
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>
          )}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 block mb-1">
          Preferred Delivery Date <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          type="date"
          value={delivery.deliveryDate}
          onChange={(e) => handleDeliveryDateChange(e.target.value)}
          onKeyDown={handleDeliveryDateKeyDown}
          min={minDeliveryDate}
          className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none"
          style={{ borderColor: errors.deliveryDate ? "#ef4444" : "#e5e7eb" }}
        />
        {errors.deliveryDate && (
          <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>
        )}
      </div>

      <div>
        <label className="text-xs text-gray-500 block mb-1">
          Order Notes <span className="text-gray-300">(optional)</span>
        </label>
        <textarea
          value={delivery.notes}
          onChange={(e) => onDeliveryChange("notes", e.target.value)}
          placeholder="Special instructions, landmark, etc."
          rows={2}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}
