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
import { catalogService } from "../services/catalog-service";
import { toast } from "sonner";
// 1. Import the same type used in the Container
import type { Product } from "@/src/data/products";
import type { HTTPError } from 'ky';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  userId?: number;
  onCartUpdate?: () => void;
  onRequireLogin?: (product: Product) => void;
}

type AddToCartStatus = "idle" | "loading" | "success" | "error";

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  userId,
  onCartUpdate,
  onRequireLogin,
}) => {
  const [deliveryOption, setDeliveryOption] = useState<"Pick up" | "Delivery Option">("Pick up");
  const [quantity, setQuantity] = useState(1);
  const [addToCartStatus, setAddToCartStatus] = useState<AddToCartStatus>("idle");

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat().format(product.productPrice);

  const handleAddToCart = async () => {
    if (!userId) {
      if (onRequireLogin) {
        onRequireLogin(product);
      } else {
        toast.error("Please log in to add items to your cart.");
      }
      return;
    }

    if (addToCartStatus === "loading") return;
    setAddToCartStatus("loading");

    try {
      await catalogService.addToCart({
        productId: Number(product.productId), // ✅ ensure number
        quantity: Number(quantity),           // ✅ ensure number
      });

      setAddToCartStatus("success");
      toast.success(`${product.productName} added to cart!`);
      onCartUpdate?.();
      setTimeout(() => setAddToCartStatus("idle"), 2000);

    } catch (error) {
      setAddToCartStatus("error");

      let message = "Failed to add to cart.";
      try {
        const httpError = error as any;
        const body = await httpError.response?.json();
        message = body?.message || httpError.message || message;
      } catch {
        message = (error as any)?.message || message;
      }

      toast.error(message);
      setTimeout(() => setAddToCartStatus("idle"), 2000);
    }
  };

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            <div className="w-full md:w-1/2 bg-[#F8F8F8] p-8 md:p-16 flex items-center justify-center relative overflow-hidden">
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

            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-white custom-scrollbar">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400">
                  {/* 2. Since Product type defines category as string, use it directly */}
                  {product.category || "Hydration"}
                </span>
                <button onClick={onClose} className="hidden md:block p-1 text-neutral-300 hover:text-secondary">
                  <X size={28} />
                </button>
              </div>

              <h2 className="text-2xl md:text-3xl font-display font-black text-secondary mb-4">
                {product.productName}
              </h2>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} className={i < 4 ? "" : "text-neutral-200"} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-neutral-500">
                    4.5 <span className="font-medium text-neutral-400 opacity-60">(120 reviews)</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-green-500 font-bold text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  In Stock
                </div>
              </div>

              <div className="bg-white border border-neutral-100 rounded-[24px] p-6 mb-8 text-center">
                <p className="text-3xl font-black text-secondary">₱{formattedPrice}</p>
              </div>

              <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
                {product.description || "Premium double-wall vacuum insulated stainless steel tumbler."}
              </p>

              <div className="mb-8">
                <p className="text-[10px] font-black uppercase text-neutral-400 mb-3">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || addToCartStatus === "loading"}
                    className="w-9 h-9 rounded-xl border-2 border-neutral-100 flex items-center justify-center font-black text-neutral-400"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-black text-secondary text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={addToCartStatus === "loading"}
                    className="w-9 h-9 rounded-xl border-2 border-neutral-100 flex items-center justify-center font-black text-neutral-400"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-end gap-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={addToCartStatus === "loading"}
                  className={cn(
                    "w-full md:w-auto h-auto py-4 px-10 rounded-2xl text-sm font-black flex items-center justify-center gap-3 group transition-all duration-300",
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