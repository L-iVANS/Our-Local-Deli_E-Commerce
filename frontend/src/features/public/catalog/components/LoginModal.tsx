"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Mail, Lock, Eye, EyeOff, LogIn, Loader2, CheckCircle2, ShoppingCart, ArrowRight,
} from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
// 1. IMPORT YOUR HOOK (adjust path as needed)
import { useLoginMutation } from "../../../auth/services/mutation"; 

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  triggerContext?: {
    action?: "add-to-cart" | "checkout" | "wishlist";
    productName?: string;
  };
}

type LoginStatus = "idle" | "loading" | "success" | "error";

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  triggerContext,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loginStatus, setLoginStatus] = useState<LoginStatus>("idle");

  // 2. INITIALIZE THE MUTATION
  const loginMutation = useLoginMutation();

  // Inside your LoginModal component...

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please enter both email and password.");
            return;
        }

        if (loginStatus === "loading") return;
        setLoginStatus("loading");

        try {
            // FIX: Map your local 'email' state to 'emailAddress' as required by the type
            await loginMutation.mutateAsync({ 
            emailAddress: email, // Changed from email to emailAddress
            password: password 
            });

            setLoginStatus("success");
            toast.success("Welcome back!");

            setTimeout(() => {
            onLoginSuccess?.();
            onClose();
            setLoginStatus("idle");
            setEmail("");
            setPassword("");
            }, 800);
        } catch (error: any) {
            setLoginStatus("error");
            const message =
            error?.response?.data?.message ||
            error?.message ||
            "Invalid credentials. Please try again.";
            toast.error(message);

            setTimeout(() => setLoginStatus("idle"), 2000);
        }
    };

  const buttonConfig = {
    idle: {
      label: "Sign In",
      icon: <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />,
      className: "bg-primary hover:bg-[#0A3A2B]/90 shadow-xl shadow-primary/20",
    },
    loading: {
      label: "Signing in...",
      icon: <Loader2 size={18} className="animate-spin" />,
      className: "bg-primary/70 cursor-not-allowed shadow-xl shadow-primary/10",
    },
    success: {
      label: "Success!",
      icon: <CheckCircle2 size={18} />,
      className: "bg-green-600 hover:bg-green-700 shadow-xl shadow-green-500/20",
    },
    error: {
      label: "Try Again",
      icon: <LogIn size={18} />,
      className: "bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/20",
    },
  }[loginStatus];

  const contextMessage = () => {
    if (!triggerContext) return null;
    switch (triggerContext.action) {
      case "add-to-cart":
        return triggerContext.productName
          ? `Sign in to add "${triggerContext.productName}" to your cart.`
          : "Sign in to add items to your cart.";
      case "checkout":
        return "Sign in to complete your purchase.";
      case "wishlist":
        return "Sign in to save items to your wishlist.";
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0A3A2B]/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#F4F4F0] rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[#A8844C] to-primary" />

            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 p-1.5 text-primary/40 hover:text-primary hover:bg-primary/5 rounded-full transition-all"
            >
              <X size={22} />
            </button>

            <div className="p-8 md:p-10">
              <div className="mb-7">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-5">
                  {triggerContext?.action === "add-to-cart" ? (
                    <ShoppingCart size={24} className="text-primary" />
                  ) : (
                    <LogIn size={24} className="text-primary" />
                  )}
                </div>

                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#A8844C] mb-2 block">
                  Account Access
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-primary mb-2 leading-tight">
                  Welcome back
                </h2>
                <p className="text-sm text-primary/60 leading-relaxed font-medium">
                  {contextMessage() || "Sign in to your account to continue shopping."}
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={loginStatus === "loading"}
                      className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-primary/10 rounded-xl text-primary placeholder:text-primary/30 font-medium text-sm focus:outline-none focus:border-primary/40 focus:bg-white transition-all disabled:opacity-60"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/50">
                      Password
                    </label>
                    <button type="button" className="text-[10px] font-black uppercase tracking-wider text-[#A8844C] hover:text-primary transition-colors">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      disabled={loginStatus === "loading"}
                      className="w-full pl-11 pr-12 py-3.5 bg-white border-2 border-primary/10 rounded-xl text-primary placeholder:text-primary/30 font-medium text-sm focus:outline-none focus:border-primary/40 focus:bg-white transition-all disabled:opacity-60"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={keepSignedIn}
                      onChange={(e) => setKeepSignedIn(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 rounded border-2 border-primary/30 bg-white peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                      {keepSignedIn && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1 5L4 8L9 2" stroke="#F4F4F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-primary/60 group-hover:text-primary transition-colors">
                    Keep me signed in
                  </span>
                </label>

                <Button
                  type="submit"
                  disabled={loginStatus === "loading"}
                  className={cn(
                    "w-full h-auto py-4 px-6 rounded-xl text-sm font-black text-[#F4F4F0] flex items-center justify-center gap-2.5 group transition-all duration-300",
                    buttonConfig.className
                  )}
                >
                  {buttonConfig.label}
                  {buttonConfig.icon}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-[#F4F4F0] text-[10px] font-black uppercase tracking-widest text-primary/40">
                    or
                  </span>
                </div>
              </div>

              <p className="text-center text-sm text-primary/60 font-medium">
                Don't have an account?{" "}
                <button type="button" className="font-black text-[#A8844C] hover:text-primary transition-colors">
                  Create one
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;