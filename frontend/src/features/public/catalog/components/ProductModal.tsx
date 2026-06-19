"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Share2,
  Star,
  Truck,
  ShoppingCart,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { cn } from "@/lib/utils";
import { catalogService } from "../services/catalog-service"; // adjust path as needed
import { toast } from "sonner"; // or your preferred toast library

interface Product {
  productId: number | string;
  productName: string;
  category: {
    categoryName: string;
  };
  productPrice: number;
  productDescription?: string;
  imageUrl?: string;
  available?: number | string;
  badge?: "Best Seller" | "New" | "Bundle";
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  userId?: number; // pass from auth context/session
  onCartUpdate?: () => void; // optional callback to refresh cart count
}

type AddToCartStatus = "idle" | "loading" | "success" | "error";

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  userId,
  onCartUpdate,
}) => {
  const [activeTier, setActiveTier] = useState<"Retail" | "Wholesale" | "Bulk">(
    "Retail"
  );
  const [selectedColor, setSelectedColor] = useState("Pink");
  const [deliveryOption, setDeliveryOption] = useState<
    "Pick up" | "Delivery Option"
  >("Pick up");
  const [quantity, setQuantity] = useState(1);
  const [addToCartStatus, setAddToCartStatus] = useState<AddToCartStatus>("idle");

  if (!product) return null;

  const colors = ["Pink", "Teal", "Gray", "Black", "Maroon"];
  const formattedPrice = new Intl.NumberFormat().format(product.productPrice);

  // ─── Add to Cart Handler ───────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    if (addToCartStatus === "loading") return;

    setAddToCartStatus("loading");

    try {
      await catalogService.addToCart({
        productId: product.productId,
        quantity,
        // selectedColor, // uncomment if color selector is active
        // selectedSize,  // uncomment if size selector is active
      });

      setAddToCartStatus("success");
      toast.success(`${product.productName} added to cart!`);
      onCartUpdate?.(); // refresh cart badge/count if provided

      // Reset button state after 2 seconds
      setTimeout(() => {
        setAddToCartStatus("idle");
      }, 2000);
    } catch (error: any) {
      setAddToCartStatus("error");
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add to cart. Please try again.";
      toast.error(message);

      setTimeout(() => {
        setAddToCartStatus("idle");
      }, 2000);
    }
  };

  // ─── Button State Config ───────────────────────────────────────────────────
  const buttonConfig = {
    idle: {
      label: "Add to Cart",
      icon: <ShoppingCart size={18} className="transition-transform group-hover:scale-110" />,
      className: "bg-primary hover:bg-accent shadow-xl shadow-primary/10",
    },
    loading: {
      label: "Adding...",
      icon: <Loader2 size={18} className="animate-spin" />,
      className: "bg-primary/70 cursor-not-allowed shadow-xl shadow-primary/10",
    },
    success: {
      label: "Added!",
      icon: <CheckCircle2 size={18} />,
      className: "bg-green-500 hover:bg-green-600 shadow-xl shadow-green-500/20",
    },
    error: {
      label: "Try Again",
      icon: <ShoppingCart size={18} />,
      className: "bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/20",
    },
  }[addToCartStatus];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* Close Button Mobile */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-secondary hover:bg-neutral-100 transition-all md:hidden"
            >
              <X size={24} />
            </button>

            {/* Left: Image Gallery */}
            <div className="w-full md:w-1/2 bg-[#F8F8F8] p-8 md:p-16 flex items-center justify-center relative overflow-hidden">
              <button className="absolute top-8 right-8 p-3 bg-white rounded-full shadow-lg text-neutral-400 hover:text-primary transition-colors">
                <Share2 size={20} />
              </button>

              <motion.img
                layoutId={`product-image-${product.productId}`}
                src={product.imageUrl || "/assets/placeholder.png"}
                alt={product.productName}
                className="w-full h-auto max-h-[500px] object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/placeholder.png";
                }}
              />
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-white custom-scrollbar">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400">
                  {product.category?.categoryName || "Hydration"}
                </span>
                <button
                  onClick={onClose}
                  className="hidden md:block p-1 text-neutral-300 hover:text-secondary transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              <h2 className="text-2xl md:text-3xl font-display font-black text-secondary mb-4 leading-tight">
                {product.productName}
              </h2>

              {/* Rating & Stock */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < 4 ? "currentColor" : "none"}
                        className={i < 4 ? "" : "text-neutral-200"}
                      />
                    ))}
                  </div>
                  {(() => {
                    const idValue =
                      typeof (product as any).id === "number"
                        ? (product as any).id
                        : Number((product as any).id) || 0;
                    const rating = (4.5 + (idValue % 5) * 0.1).toFixed(1);
                    const reviews = ((idValue * 123) % 400) + 50;
                    return (
                      <span className="text-xs font-bold text-neutral-500">
                        {rating}{" "}
                        <span className="font-medium text-neutral-400 opacity-60">
                          ({reviews} reviews)
                        </span>
                      </span>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-2 text-green-500 font-bold text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  In Stock
                </div>
              </div>

              {/* Price Card */}
              <div className="bg-white border border-neutral-100 rounded-[24px] p-6 mb-8 shadow-sm text-center">
                <p className="text-3xl font-black text-secondary">
                  ₱{formattedPrice}
                </p>
              </div>

              <p className="text-sm text-neutral-500 mb-8 leading-relaxed font-medium">
                {product.productDescription ||
                  "Premium double-wall vacuum insulated stainless steel tumbler that keeps drinks cold for 24 hours and hot for 12 hours."}
              </p>

              {/* Quantity Selector */}
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">
                  Quantity
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || addToCartStatus === "loading"}
                    className="w-9 h-9 rounded-xl border-2 border-neutral-100 flex items-center justify-center font-black text-neutral-400 hover:border-primary hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-black text-secondary text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={addToCartStatus === "loading"}
                    className="w-9 h-9 rounded-xl border-2 border-neutral-100 flex items-center justify-center font-black text-neutral-400 hover:border-primary hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Delivery Options Section */}
              <div className="mb-10 border-t border-neutral-100 pt-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">
                  Delivery Options
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Option 1: Pick up */}
                  <div
                    onClick={() => setDeliveryOption("Pick up")}
                    className={cn(
                      "flex-1 p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center",
                      deliveryOption === "Pick up"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-neutral-100 hover:border-neutral-200"
                    )}
                  >
                    <div className="flex flex-col items-center gap-2 mb-4 -translate-y-1">
                      <div className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-xl text-primary mb-1">
                        <Truck size={20} />
                      </div>
                      <span
                        className={cn(
                          "font-bold text-sm",
                          deliveryOption === "Pick up"
                            ? "text-secondary"
                            : "text-neutral-400"
                        )}
                      >
                        Pick up
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-auto">
                      <span className="px-2 py-1 bg-white border border-neutral-100 rounded-md text-[8px] font-black text-neutral-400">
                        PAYMONGO
                      </span>
                      <span className="px-2 py-1 bg-white border border-neutral-100 rounded-md text-[8px] font-black text-neutral-400">
                        MANUAL
                      </span>
                    </div>
                  </div>

                  {/* Option 2: Delivery Option (Disabled) */}
                  <div className="flex-1 p-5 rounded-2xl border-2 border-neutral-100 opacity-60 cursor-not-allowed flex flex-col items-center text-center bg-neutral-50">
                    <div className="flex flex-col items-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-xl text-neutral-300 mb-1">
                        <Share2 size={20} />
                      </div>
                      <span className="font-bold text-sm text-neutral-400">
                        Delivery Option
                      </span>
                    </div>
                    <span className="mt-auto px-2 py-0.5 bg-neutral-200 rounded text-[8px] font-black text-neutral-500 uppercase">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-end gap-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={addToCartStatus === "loading"}
                  className={cn(
                    "w-full md:w-auto h-auto py-4 px-10 rounded-2xl text-sm font-black flex items-center justify-center gap-3 group shrink-0 transition-all duration-300",
                    buttonConfig.className
                  )}
                >
                  {buttonConfig.icon}
                  {buttonConfig.label}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;