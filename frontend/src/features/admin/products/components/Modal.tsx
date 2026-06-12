import React, { ReactNode } from "react";
import { X } from "lucide-react";
import { COLORS } from "../constants/colors";
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
  headerBg = COLORS.bgLight,
}: ModalProps) {
  if (!isOpen && !isAnimating) return null;

  const showBackdrop = isOpen || isAnimating;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed top-0 left-0 w-screen h-screen z-40 ${
          showBackdrop ? styles.backdrop : styles["backdrop--closing"]
        }`}
        style={{ background: COLORS.backdrop }}
        onClick={onClose}
        onAnimationEnd={onAnimationEnd}
      />

      {/* Modal Container */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`relative bg-white rounded-2xl shadow-2xl w-full mx-4 overflow-hidden pointer-events-auto ${
            maxWidthClasses[maxWidth]
          } ${showBackdrop ? styles.modal : styles["modal--closing"]}`}
          onAnimationEnd={onAnimationEnd}
        >
          {/* Header */}
          <div
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{
              backgroundColor: headerBg,
              borderColor: COLORS.borderDefault,
            }}
          >
            <div className="flex items-center gap-3">
              {icon && (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: COLORS.bgLighter }}
                >
                  {icon}
                </div>
              )}
              <div>
                <h2
                  className="text-lg font-bold"
                  style={{ color: COLORS.textDark }}
                >
                  {title}
                </h2>
                {subtitle && (
                  <p
                    className="text-sm"
                    style={{ color: COLORS.textTertiary }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} style={{ color: COLORS.textSecondary }} />
            </button>
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </>
  );
}
