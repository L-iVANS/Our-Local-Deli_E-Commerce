import React, { ReactNode } from "react";
import { X } from "lucide-react";
import styles from "../styles/modal.module.css";

interface ModalProps {
  isOpen: boolean;
  isAnimating: boolean;
  onClose: () => void;
  onAnimationEnd?: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  /** Optional override for header background (Tailwind class). Defaults to soft green tint. */
  headerBg?: string;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export function Modal({
  isOpen,
  isAnimating,
  onClose,
  onAnimationEnd,
  title,
  subtitle,
  icon,
  children,
  maxWidth = "2xl",
  headerBg,
}: ModalProps) {
  if (!isOpen && !isAnimating) return null;

  const showBackdrop = isOpen || isAnimating;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed top-0 left-0 w-screen h-screen z-40 bg-black/50 ${
          showBackdrop ? styles.backdrop : styles["backdrop--closing"]
        }`}
        onClick={onClose}
        onAnimationEnd={onAnimationEnd}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={[
            "relative w-full mx-4 overflow-hidden rounded-2xl shadow-2xl pointer-events-auto",
            "bg-white dark:bg-card",
            "border border-gray-200 dark:border-sidebar-border",
            maxWidthClasses[maxWidth],
            showBackdrop ? styles.modal : styles["modal--closing"],
          ].join(" ")}
          onAnimationEnd={onAnimationEnd}
        >
          {/* Header */}
          <div
            className={[
              "px-6 py-4 flex items-center justify-between",
              "border-b border-gray-200 dark:border-sidebar-border",
              // ✅ soft green tint by default (same vibe as your old soft red)
              headerBg ?? "bg-primary/5 dark:bg-primary/20",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              {icon && (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center
                             bg-white dark:bg-card
                             border border-gray-200 dark:border-sidebar-border
                             shadow-sm"
                >
                  {icon}
                </div>
              )}
              <div>
                {/* ✅ Playfair Display title in dark green / gold */}
                <h2
                  className="font-serif text-lg font-semibold leading-tight
                             text-primary dark:text-gold-light"
                >
                  {title}
                </h2>
                {subtitle && (
                  <p className="font-sans text-sm text-gray-500 dark:text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1 rounded-lg transition-colors
                         text-gray-500 hover:text-gray-800 hover:bg-gray-200
                         dark:text-muted-foreground dark:hover:text-gold dark:hover:bg-sidebar-accent"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </>
  );
}