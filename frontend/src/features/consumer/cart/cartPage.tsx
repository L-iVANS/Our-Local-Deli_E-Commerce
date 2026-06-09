"use client";

import { useRouter } from "next/navigation";
// import { useCartLogic } from "./hooks/useCartLogic";
import {
  CartEmpty,
  CartItems,
  CartSummary,
  OrderConfirmModal,
} from "./components/index";
import { PaymongoCheckoutModal } from "@/features/consumer/checkout/index";
import { CART_COLORS } from "./constants/index";

export function Cart() {
  const router = useRouter();
  // const {
  //   company,
  //   items,
  //   selectedItems,
  //   selectedItemIds,
  //   itemCount,
  //   selectedItemCount,
  //   selectedSubtotal,
  //   tier,
  //   showModal,
  //   setShowModal,
  //   delivery,
  //   setDelivery,
  //   confirmed,
  //   setConfirmed,
  //   errors,
  //   setErrors,
  //   placing,
  //   selectedMoqWarnings,
  //   orderId,
  //   orderNumber,
  //   paymentTrigger,
  //   resetPaymentTrigger,
  //   hasSelectedItems,
  //   handlePlaceOrder,
  //   handleCloseModal,
  //   onUpdateQty,
  //   onRemoveItem,
  //   onToggleItemSelection,
  // } = useCartLogic();

  // console.log("[cartPage] paymentTrigger:", paymentTrigger);
  // console.log("[cartPage] About to render OrderConfirmModal with paymentTrigger:", paymentTrigger, "showModal:", showModal);

  // if (!company) return null;
  // if (items.length === 0 && !paymentTrigger) return <CartEmpty />;

  // if (paymentTrigger) {
  //   console.log("[cartPage] ⭐ RENDER CONDITION TRUE - About to render PaymongoCheckoutModal");
  // }

  // const deliveryFee = selectedSubtotal >= 1500 ? 0 : 350;
  // const currentGrandTotal = selectedSubtotal + deliveryFee;
  // const payableAmount = paymentTrigger?.orderAmount ?? currentGrandTotal;

  // const handlePaymongoClose = () => {
  //   console.log("[cartPage] PayMongo modal closed");
  //   resetPaymentTrigger();
  //   setShowModal(false);
  //   // Redirect to Processing section of orders
  //   router.push("/b2b/my-orders?tab=Processing");
  // };

  return (
    <div
      className="bg-gray-50 min-h-screen"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* PayMongo Modal - Render at top level, not inside OrderConfirmModal */}
      {/* {paymentTrigger && (
        <PaymongoCheckoutModal
          isOpen={true}
          orderId={paymentTrigger.orderId}
          orderAmount={payableAmount}
          orderNumber={paymentTrigger.orderNumber}
          onClose={handlePaymongoClose}
          onSuccess={() => {
            console.log("[cartPage] PayMongo payment successful");
            resetPaymentTrigger();
            setShowModal(false);
          }}
        />
      )} */}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <a href="/#hero" className="hover:text-red-600">
                Home
              </a>
              <span>/</span>
              <span className="text-gray-600">Order Cart</span>
            </div>
            <h1
              className="text-gray-900"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "1.5rem",
              }}
            >
              Order Cart
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">
              {/* {itemCount} items · {tier} pricing active */}
            </p>
          </div>
          <a
            href="../app/b2b/products"
            className="text-sm font-semibold flex items-center gap-1.5 hover:opacity-80 transition-opacity text-accent"
          >
            + Add More Products
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* <CartItems
          items={items}
          company={company}
          moqWarnings={selectedMoqWarnings}
          selectedItemIds={selectedItemIds}
          onUpdateQty={onUpdateQty}
          onRemoveItem={onRemoveItem}
          onToggleItemSelection={onToggleItemSelection}
        /> */}

        {/* <CartSummary
          items={selectedItems}
          company={company}
          subtotal={selectedSubtotal}
          itemCount={selectedItemCount}
          hasSelectedItems={hasSelectedItems}
          onProceed={() => hasSelectedItems && setShowModal(true)}
        />
          */}
      </div>

      {/* <OrderConfirmModal
        key={`modal-${paymentTrigger?.orderId || 'initial'}`}
        isOpen={showModal && !paymentTrigger}
        onClose={handleCloseModal}
        items={selectedItems}
        company={company}
        subtotal={selectedSubtotal}
        itemCount={selectedItemCount}
        moqWarnings={selectedMoqWarnings}
        delivery={delivery}
        errors={errors}
        confirmed={confirmed}
        placing={placing}
        onDeliveryChange={(field, value) => {
          setDelivery((prev) => {
            const updated = { ...prev, [field]: value };
            // Auto-update address when toggling usePrimaryAddress
            if (field === "usePrimaryAddress" && value) {
              updated.address = company.address || "";
            }
            return updated;
          });
        }}
        onConfirmedChange={(value) => {
          setConfirmed(value);
          setErrors((prev) => ({ ...prev, notes: undefined }));
        }}
        onPlaceOrder={handlePlaceOrder}
        orderId={undefined}
        orderNumber={undefined}
      /> */}
    </div>
  );
}
